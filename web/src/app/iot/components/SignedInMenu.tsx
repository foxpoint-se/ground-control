import { useRouter } from "next/navigation";
import { MenuItem, NavBar } from "../../components/new/NavBar";
import { useAmplifyAuth } from "./authContext";
import { useState } from "react";

type SignedInMenuProps = {
  extraMenuItems?: MenuItem[];
};

export const SignedInMenu = ({ extraMenuItems = [] }: SignedInMenuProps) => {
  const amplifyAuth = useAmplifyAuth();
  const router = useRouter();
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (amplifyAuth.isLoading) {
    return null;
  }

  if (amplifyAuth.hasError) {
    return <div className="p-sm">{amplifyAuth.errorMessage}</div>;
  }
  const handleSignOutClick = () => {
    router.push("/");
    setTimeout(() => {
      amplifyAuth.data.signOut();
    }, 100);
  };

  const enterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
      setIsFullScreen(true);
    }
  };
  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const fullScreenLabel = isFullScreen ? "Exit fullscreen" : "Fullscreen";
  const fullScreenAction = isFullScreen ? exitFullscreen : enterFullscreen;

  return (
    <NavBar
      userSlot={<div>{amplifyAuth.data.user.username}</div>}
      menuItems={[
        ...extraMenuItems,
        {
          label: fullScreenLabel,
          callback: fullScreenAction,
          hasCallback: true,
        },
        {
          label: "Sign out",
          callback: handleSignOutClick,
          hasCallback: true,
        },
      ]}
    />
  );
};
