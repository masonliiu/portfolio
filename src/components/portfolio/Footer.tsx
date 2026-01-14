export default function Footer() {
  return (
    <footer className="page-shell footer">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <span>© {new Date().getFullYear()} Mason Liu</span>
        <div className="flex flex-wrap items-center gap-4">
          <a href="mailto:liumasn@gmail.com">Email</a>
          <a
            href="https://www.linkedin.com/in/masonliiu/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <a href="https://github.com/masonliiu" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
