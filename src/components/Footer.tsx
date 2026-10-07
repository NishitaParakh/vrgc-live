import Link from 'next/link';

export function Footer() {
  return (
    <footer className="ink-footer" aria-label="Site Footer">
      <div className="if-top">
        {/* COLUMN 1 — BRAND & CTA */}
        <div className="if-brand-col">
          <div className="if-brand-header">
            <div className="if-brand-logo-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/vrgc_logo.jpg"
                alt="VRGC Logo"
                className="if-brand-logo"
              />
            </div>
            <span className="if-brand-title">VRGC</span>
          </div>

          <p className="if-brand-desc">
            Virtual Reality and Gaming Club &mdash; VIT Bhopal University.
          </p>
          <div className="if-brand-tagline">
            E-SPORTS &bull; DEVELOPMENT &bull; WORKSHOP &bull; BOOTCAMP
          </div>

          {/* FOOTER CTA */}
          <div className="if-cta-card">
            <div className="if-cta-title">
              <span className="if-cta-indicator" />
              READY TO PLAY?
            </div>
            <p className="if-cta-text">
              Join VRGC and be part of the next generation of gaming, esports and development at VIT Bhopal.
            </p>
            <a
              href="https://forms.gle/xEpZBroHH5ro3Z9q8"
              target="_blank"
              rel="noopener noreferrer"
              className="if-cta-btn"
            >
              JOIN THE CLUB &rarr;
            </a>
          </div>
        </div>

        {/* COLUMN 2 — EXPLORE */}
        <div className="if-col">
          <h4>EXPLORE</h4>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/about">Studio &amp; About</Link>
            </li>
            <li>
              <Link href="/events">Tournaments</Link>
            </li>
            <li>
              <Link href="/live">Live Arena</Link>
            </li>
            <li>
              <Link href="/community">Community</Link>
            </li>
          </ul>
        </div>

        {/* COLUMN 3 — RESOURCES */}
        <div className="if-col">
          <h4>RESOURCES</h4>
          <ul>
            <li>
              <Link href="/tools">Organizer Tools</Link>
            </li>
            <li>
              <Link href="/events">Events</Link>
            </li>
            <li>
              <Link href="/events">Workshops</Link>
            </li>
            <li>
              <Link href="/events">Bootcamp</Link>
            </li>
            <li>
              <a href="https://discord.gg/vrgc" target="_blank" rel="noopener noreferrer">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* COLUMN 4 — CONNECT */}
        <div className="if-col">
          <h4>CONNECT</h4>
          <ul>
            <li>
              <a href="https://discord.gg/vrgc" target="_blank" rel="noopener noreferrer">
                Discord Server
              </a>
            </li>
            <li>
              <a href="https://instagram.com/vrgc.vitb" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://youtube.com/@vrgcvitb" target="_blank" rel="noopener noreferrer">
                YouTube Channel
              </a>
            </li>
          </ul>

          {/* Minimalist Monochrome Social Icons */}
          <div className="if-social-icons" aria-label="Social Profiles">
            {/* Discord */}
            <a
              href="https://discord.gg/vrgc"
              target="_blank"
              rel="noopener noreferrer"
              className="if-social-icon-link"
              title="Discord"
              aria-label="Discord Server"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/vrgc.vitb"
              target="_blank"
              rel="noopener noreferrer"
              className="if-social-icon-link"
              title="Instagram"
              aria-label="Instagram Profile"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com/@vrgcvitb"
              target="_blank"
              rel="noopener noreferrer"
              className="if-social-icon-link"
              title="YouTube"
              aria-label="YouTube Channel"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>

            {/* GitHub */}

          </div>
        </div>
      </div>

      {/* BOTTOM COPYRIGHT ROW */}
      <div className="if-bottom">
        <div className="if-bottom-left">
          <span>&copy; {new Date().getFullYear()} VIRTUAL REALITY AND GAMING CLUB (VRGC) &mdash; VIT BHOPAL. ALL RIGHTS RESERVED.</span>
        </div>
        <div className="if-bottom-right">
          <Link href="/sitemap.xml" target="_blank" rel="noopener noreferrer">
            SITEMAP
          </Link>
        </div>
      </div>
    </footer>
  );
}
