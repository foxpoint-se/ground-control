import Link from "next/link";
import { ReactNode } from "react";

type LinkAction = {
  label: string;
  href: string;
  hasCallback: false;
};

type CallbackAction = {
  label: string;
  callback: () => void;
  hasCallback: true;
};

export type MenuItem = LinkAction | CallbackAction;

const MenuListItem = ({ menuItem }: { menuItem: MenuItem }) => {
  if (menuItem.hasCallback) {
    return <a onClick={menuItem.callback}>{menuItem.label}</a>;
  }
  return <a href={menuItem.href}>{menuItem.label}</a>;
};

const Menu = ({ menuItems }: { menuItems: MenuItem[] }) => {
  return (
    <div className="dropdown dropdown-bottom dropdown-end">
      <label tabIndex={0} className="btn btn-sm btn-ghost btn-circle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 9h16.5m-16.5 6.75h16.5"
          ></path>
        </svg>
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-gray-100 rounded-box w-52"
      >
        {menuItems.map((m) => {
          return (
            <li key={m.label}>
              <MenuListItem menuItem={m} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const NavBar = ({
  menuItems,
  userSlot,
  children,
}: {
  menuItems: MenuItem[];
  userSlot?: ReactNode;
  children?: ReactNode;
}) => {
  return (
    <div className="bg-[#cecbdb42] w-full shadow mb-md">
      <div className="px-sm mx-auto max-w-screen-2xl">
        <div className="navbar min-h-0 px-0">
          <div className="flex-1">
            <Link
              href="/"
              className="btn btn-ghost btn-sm px-xs"
              aria-label="Home"
            >
              <img
                src="/images/foxpoint_logo_full.svg"
                className="h-4"
                alt="Foxpoint logo"
              />
            </Link>
          </div>
          <div className="flex items-center space-x-sm">
            {userSlot && userSlot}
            {menuItems.length > 0 && <Menu menuItems={menuItems} />}
          </div>
        </div>
      </div>

      {children && (
        <div className="bg-[#cecbdb42] w-full">
          <div className="px-sm mx-auto max-w-screen-2xl">{children}</div>
        </div>
      )}
    </div>
  );
};
