import { HalftoneDots } from '@paper-design/shaders-react'
import Navbar from '../components/Navbar'
import EmailForm from '../components/EmailForm'
import styles from './About.module.css'

const bodyText = `AI gives you a baseline, but it can't make your product feel 100% right - the spacing is off, interactions feel clunky, and the design looks AI-generated. You can tell something's not quite right, but you don't know how to fix it.\n\nThat's where Oreo comes in - an agentic UI library with 500+ components, designed to help you take your AI product from 0 → 1 instantly, with polished taste and design details built in - no second pass needed.\n\nCrafted by senior and founding designers from design system teams at top tech companies - systems that serve billions of users worldwide - Oreo is built with an uncompromising focus on craft and execution.\n\nFor the team behind the scenes, Oreo is built with complementary strengths: It has product designers who shape the overall experience, design engineers who bring designs to life in code, and product design creatives who craft the visual details of each component. \n\nTogether, we're driven by a shared vision - to bridge the gap where AI falls short, and help builders quickly turn ideas into polished products by delivering the design quality that's hard to achieve on your own.\n\nDon't worry, we got you back.`

const team = [
  {
    name: 'Nicole',
    role: 'Product Designer ',
    companies: 'TapNow, TikTok, frog',
    image: '/images/nicole.png',
    shaderStyle: { width: 409, height: 409, left: -72, top: -72 },
    radius: 1.25,
    size: 0.5,
    social: {
      x: 'https://x.com/nicoletang0717',
      linkedin: 'https://www.linkedin.com/in/nicoletangdesign/',
    },
  },
  {
    name: 'Yiqi',
    role: 'Creative Designer',
    companies: 'Willow, TikTok, Tencent, Meta',
    image: '/images/yiqi.png',
    shaderStyle: { width: 357, height: 357, left: -46, top: -36 },
    radius: 1.25,
    size: 0.5,
    social: {
      x: 'https://x.com/YanYiqi73877',
      linkedin: 'https://www.linkedin.com/in/yiqiyan2015/',
    },
  },
  {
    name: 'Mona the Cat',
    role: 'Design Engineer',
    companies: 'Just a cat… or is it? 🐾',
    image: '/images/mona.png',
    shaderStyle: { width: 359, height: 359, left: -100, top: -99 },
    radius: 1,
    size: 0.01,
    social: {
      x: 'https://x.com/mona_biasia',
    },
  },
]

export default function About() {
  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.main}>
        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.iconBlock}>
            <img
              src="/images/about-icon.png"
              alt=""
              width={52}
              height={52}
              className={styles.aboutIcon}
            />
          </div>
          <h1 className={styles.headline}>Design is the last to moat.</h1>
          <h2 className={styles.subheadline}>
            Oreo UI library targeting for a genetic AI product helps you close the last mile.
          </h2>
        </div>

        <div className={styles.formWrap}>
          <EmailForm />
        </div>

        {/* Body text */}
        <div className={styles.body}>
          {bodyText}
        </div>

        {/* Team */}
        <div className={styles.team}>
          {team.map((member) => (
            <div key={member.name} className={styles.member}>
              <div className={styles.portrait}>
                <HalftoneDots
                  contrast={0.4}
                  originalColors={false}
                  inverted={false}
                  grid="hex"
                  radius={member.radius}
                  size={member.size}
                  scale={0.8}
                  image={member.image}
                  grainMixer={0.2}
                  grainOverlay={0.2}
                  grainSize={0.5}
                  type="gooey"
                  fit="contain"
                  colorFront="#2B2B2B"
                  colorBack="#00000000"
                  style={{
                    position: 'absolute',
                    width: member.shaderStyle.width,
                    height: member.shaderStyle.height,
                    left: member.shaderStyle.left,
                    top: member.shaderStyle.top,
                  }}
                />
              </div>
              <div className={styles.memberInfo}>
                <div className={styles.memberName}>{member.name}</div>
                <div className={styles.memberRole}>{member.role}</div>
                <div className={styles.memberCompanies}>{member.companies}</div>
              </div>
              {member.social && (
                <div className={styles.socialLinks}>
                  {member.social.x && (
                    <a href={member.social.x} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label={`${member.name} on X`}>
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                    </a>
                  )}
                  {member.social.linkedin && (
                    <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label={`${member.name} on LinkedIn`}>
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
