export default function Footer() {
  return (
    <footer className="page-shell footer">
      <div className="flex flex-col items-start gap-4 text-left">
        <span>© {new Date().getFullYear()} Mason Liu</span>
        <div className="flex flex-wrap items-center gap-4">
          <a href="mailto:liumasn@gmail.com" data-magnet data-cursor="Email">
            Email
          </a>
          <a
            href="https://www.linkedin.com/in/masonliiu/"
            target="_blank"
            rel="noreferrer"
            data-magnet
            data-cursor="LinkedIn"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/masonliiu"
            target="_blank"
            rel="noreferrer"
            data-magnet
            data-cursor="GitHub"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
