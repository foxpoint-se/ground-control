import Link from "next/link";

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
    <nav className="text-sm breadcrumbs py-xs">
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        {crumbs.map((c) => {
          return (
            <li key={c.href}>
              <Link href={c.href}>{c.label}</Link>
            </li>
          );
        })}
        <li className="text-neutral-500">{currentPage}</li>
      </ul>
    </nav>
  );
};
