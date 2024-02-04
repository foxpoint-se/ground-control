type Crumb = {
  label: string;
  href: string;
};

type BreadcrumbsProps = {
  currentPage: string;
  crumbs: Crumb[];
};

export const Breadcrumbs = ({ currentPage, crumbs }: BreadcrumbsProps) => {
  return (
    <nav className="text-sm breadcrumbs">
      <ul>
        <li>
          <a href="/">Home</a>
        </li>
        {crumbs.map((c) => {
          return (
            <li key={c.href}>
              <a href={c.href}>{c.label}</a>
            </li>
          );
        })}
        <li className="text-neutral-500">{currentPage}</li>
      </ul>
    </nav>
  );
};
