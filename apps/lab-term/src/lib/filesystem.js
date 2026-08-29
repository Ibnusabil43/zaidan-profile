import { slugify } from './slug.js'

/**
 * Turns @zaidan/data into an in-memory filesystem tree (lab-term.md §2.1).
 * Every node is `{ type: 'dir', name, path, children }` or
 * `{ type: 'file', name, path, kind, data, render() }`.
 *
 * `path` never has a leading or trailing slash; the root's own path is `''`.
 * Paths are derived from data fields that already exist (project.id,
 * slugified titles) — not a new `path` field on the data itself, per PRD
 * DR-5: a hand-written path can drift from the id it's supposed to mirror,
 * a derived one can't.
 *
 * `render()` returns a plain string, not JSX — cat output is textual, and a
 * plain string keeps this module DOM-free and easy to unit-check, same
 * reasoning as corridorLayout.js in the 3D Lab.
 */

function join(...parts) {
  return parts.filter(Boolean).join('/')
}

function file(name, path, kind, data, render, binary = false) {
  return { type: 'file', name, path, kind, data, render, binary }
}

function dir(name, path, children) {
  return { type: 'dir', name, path, children }
}

function renderProfile(profile) {
  return [
    `# ${profile.name}`,
    '',
    profile.status,
    '',
    profile.summary,
    '',
    `Roles: ${profile.roles.join(', ')}`,
  ].join('\n')
}

function renderExperience(role) {
  const lines = [
    `# ${role.title}`,
    '',
    `${role.company} · ${role.location}`,
    `${role.period} · ${role.type}`,
    '',
  ]
  for (const r of role.responsibilities) lines.push(`- ${r}`)
  return lines.join('\n')
}

// Wraps each item as inline code (`` `x` ``) — DESIGN §5.3 keeps stack/tech
// tags mono even inside prose, and inline code is the one real-markdown
// construct that means exactly that, so this isn't a hack layered on top of
// markdown, it's markdown saying what it already means.
function codeList(items) {
  return items.map((t) => `\`${t}\``).join(', ')
}

function renderProject(project) {
  const lines = [
    `# ${project.title}`,
    '',
    project.subtitle,
    '',
    `${project.role} · ${project.year}`,
    '',
    project.description,
  ]
  if (project.highlights?.length > 0) {
    lines.push('', 'Highlights:')
    for (const h of project.highlights) lines.push(`- ${h}`)
  }
  lines.push('', `Stack: ${codeList(project.tech)}`)
  if (project.internal) {
    lines.push('', '`[internal]` — repository is private, no public link.')
  } else if (project.links?.length > 0) {
    lines.push('', 'Links:')
    for (const l of project.links) lines.push(`- [${l.label}](${l.href})`)
  }
  return lines.join('\n')
}

function renderEarlierWork(work) {
  return [
    `# ${work.title}`,
    '',
    `${work.year} · ${work.tech}`,
    '',
    work.note,
    '',
    `- [Code](${work.href})`,
  ].join('\n')
}

function renderSkill(name, category) {
  return `${name}\n\nCategory: ${category}`
}

function renderAchievement(achievement) {
  return [
    `# ${achievement.title}`,
    '',
    achievement.description,
    '',
    `${achievement.institution} · ${achievement.year}`,
  ].join('\n')
}

function renderEducation(educationList) {
  const blocks = educationList.map((ed) => {
    const lines = [
      `# ${ed.degree}`,
      '',
      `${ed.institution}`,
      `${ed.period} · GPA ${ed.gpa}`,
      '',
    ]
    for (const d of ed.details) lines.push(`- ${d}`)
    return lines.join('\n')
  })
  return blocks.join('\n\n---\n\n')
}

/**
 * `resume.pdf` isn't a document, so this isn't really "content" the way the
 * other `render()` functions are — it exists so `cat` has something correct
 * to say (§2.1: "cat nolak sambil ngajarin") if someone tries it on a binary
 * file. The actual UI (download card + button) is Preview.jsx's job, keyed
 * off `kind === 'resume'`, not off parsing this string.
 */
function renderResume(resume) {
  return resume.available
    ? `Binary file (${resume.filename}) — use 'open ${resume.filename}' instead.`
    : `Binary file (${resume.filename}) — not uploaded yet.`
}

function renderContact(profile) {
  return [
    `Email:    ${profile.email}`,
    `Phone:    ${profile.phone}`,
    `LinkedIn: ${profile.linkedin}`,
    `GitHub:   ${profile.github}`,
  ].join('\n')
}

/** Builds the whole tree. Called once; the result is treated as read-only. */
export function buildFilesystem(data) {
  const { profile, experience, projects, earlierWork, skills, achievements, education } = data

  const experienceDir = dir(
    'experience',
    'experience',
    experience.map((role) => {
      const name = `${slugify(role.title)}.md`
      const path = join('experience', name)
      return file(name, path, 'experience', role, () => renderExperience(role))
    })
  )

  const archiveDir = dir(
    'archive',
    'projects/archive',
    earlierWork.map((work) => {
      const name = `${slugify(work.title)}.md`
      const path = join('projects/archive', name)
      return file(name, path, 'earlierWork', work, () => renderEarlierWork(work))
    })
  )

  const projectsDir = dir('projects', 'projects', [
    ...projects.map((project) => {
      const name = `${project.id}.md`
      const path = join('projects', name)
      return file(name, path, 'project', project, () => renderProject(project))
    }),
    archiveDir,
  ])

  const skillsDir = dir(
    'skills',
    'skills',
    Object.entries(skills).map(([category, names]) => {
      const categorySlug = slugify(category)
      const categoryPath = join('skills', categorySlug)
      return dir(
        categorySlug,
        categoryPath,
        names.map((name) => {
          const fileName = `${slugify(name)}.md`
          const path = join(categoryPath, fileName)
          return file(fileName, path, 'skill', { name, category }, () => renderSkill(name, category))
        })
      )
    })
  )

  const achievementsDir = dir(
    'achievements',
    'achievements',
    achievements.map((a) => {
      const name = `${slugify(a.title)}.md`
      const path = join('achievements', name)
      return file(name, path, 'achievement', a, () => renderAchievement(a))
    })
  )

  const root = dir('~', '', [
    file('README.md', 'README.md', 'profile', profile, () => renderProfile(profile)),
    file(profile.resume.filename, profile.resume.filename, 'resume', profile.resume, () => renderResume(profile.resume), true),
    experienceDir,
    projectsDir,
    skillsDir,
    achievementsDir,
    file('education.md', 'education.md', 'education', education, () => renderEducation(education)),
    file('contact', 'contact', 'contact', profile, () => renderContact(profile)),
  ])

  return root
}

/** Finds a node by its exact path (no `..`/`.` resolution — see resolvePath). */
export function findNode(root, path) {
  if (path === '' || path === '~') return root
  const segments = path.split('/').filter(Boolean)
  let node = root
  for (const segment of segments) {
    if (node.type !== 'dir') return null
    const next = node.children.find((c) => c.name === segment)
    if (!next) return null
    node = next
  }
  return node
}

/**
 * Resolves a `cd`/`cat`-style argument against the current directory into an
 * absolute path — handles `..`, `.`, `~`, and both relative and absolute
 * (leading `/`) input, the same rules a real shell uses.
 *
 * Deliberately has no special case for an empty `input`: "no argument" means
 * something different per command (current dir for `ls`/`tree`, root for
 * `cd`), so that decision belongs to the caller in commands.js, not here. An
 * earlier version special-cased `''` as "root" and silently broke `ls` with
 * no argument — it always listed the root instead of cwd.
 */
export function resolvePath(cwd, input) {
  if (input === '~') return ''
  const absolute = input.startsWith('/') || input.startsWith('~/')
  const base = absolute ? [] : cwd.split('/').filter(Boolean)
  const rawInput = input.startsWith('~/') ? input.slice(2) : input.startsWith('/') ? input.slice(1) : input
  const parts = rawInput.split('/').filter(Boolean)

  const stack = [...base]
  for (const part of parts) {
    if (part === '.') continue
    if (part === '..') stack.pop()
    else stack.push(part)
  }
  return stack.join('/')
}

/**
 * URL paths drop the `.md` extension (PRD's own example is
 * `/#/projects/t24-toolkit`, not `t24-toolkit.md`) — filesystem paths keep
 * it, because `cat`/`ls`/`tree` output should look like a real file listing.
 * These two convert between them; `contact` and directories have no
 * extension either way, so they pass through unchanged.
 */
export function toUrlPath(fsPath) {
  return fsPath.endsWith('.md') ? fsPath.slice(0, -3) : fsPath
}

export function findNodeByUrlPath(root, urlPath) {
  const clean = urlPath.replace(/^\/+|\/+$/g, '')
  return findNode(root, clean) ?? findNode(root, `${clean}.md`)
}
