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

type MenuItem = LinkAction | CallbackAction;

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

export const NavBar = ({ menuItems }: { menuItems: MenuItem[] }) => {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a href="/" className="btn btn-ghost btn-sm px-sm" aria-label="Home">
          <img
            src="/images/foxpoint_logo_full.svg"
            className="h-4"
            alt="Foxpoint logo"
          />
        </a>
      </div>
      {menuItems.length > 0 && <Menu menuItems={menuItems} />}
    </div>
  );
};
