import { useCurrentUser } from "../../context/CurrentUserContext";
import { useDefaultTools } from "../../context/DefaultToolsContext";
import { Tool } from "../../interfaces/toolsData";
import { logUserActivity } from "../../services/user/activityTrack";
import "./banner.css";
export default function WelcomeBanner() {
  const { allTools } = useDefaultTools();
  const { currentUser } = useCurrentUser();
  const featuredTools = ["Keeper"];
  const partneredTool = featuredTools
    .map((name) => allTools.find((tool) => tool.title === name))
    .filter((tool): tool is Tool => !!tool);

  if (partneredTool.length === 0) return null;
  return (
    <div className="mb-5">
      <div className="banner-2">
        <div className="floating-shapes">
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
        </div>

        <div className="content">
          <div className="logo-section">
            <div className="logo">
              <img
                src={partneredTool[0]?.toolLogo}
                className="rounded-full relative"
                alt="logo"
              />
            </div>
            <div className="brand-name font-bold text-lg">Keeper</div>
          </div>

          <div className="text-content">
            <h2 className="headline">Protect Your Passwords</h2>
            <p className="description">
            Keeper keeps your logins safe and accessible so you never have to remember them all. A smart pick for anyone who values security.
            </p>
          </div>
        </div>

        <div className="cta-section">
          <button
            onClick={async () => {
              window.open(partneredTool[0].url, "_blank");
              await logUserActivity({
                userId: currentUser?.id as string,
                action: `Tried ${partneredTool[0]?.title}`,
                metadata: {
                  service: "homepage",
                  toolName: partneredTool[0]?.title,
                },
              });
            }}
            className="cta-button"
          >
            Try Keeper
          </button>
        </div>
      </div>
    </div>
  );
}
