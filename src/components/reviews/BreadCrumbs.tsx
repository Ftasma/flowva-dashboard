import { useNavigate, useLocation } from "react-router-dom";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";

interface Tool {
  id: string;
  title: string;
  desc: string;
  logo: string | undefined;
}

interface BreadcrumbItemProps {
  selectedTool: Tool | null;
  toolId: string | null;
  setSelectedTool: React.Dispatch<React.SetStateAction<Tool | null>>;
}

const Breadcrumbs = ({
  selectedTool,
  toolId,
  setSelectedTool,
}: BreadcrumbItemProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isToolPage = toolId && selectedTool?.title;

  const breadcrumbs = [
    {
      label: "Library",
      onClick: () => {
        navigate("/dashboard/library");
        setSelectedTool(null);
      },
      // Only active when NOT on tool page and exactly at library
      active: pathname === "/dashboard/library" && !isToolPage,
    },
    {
      label: "Reviews",
      onClick: () => {
        navigate("/dashboard/library/reviews");
        setSelectedTool(null);
      },
      // Only active when NOT on tool page and at reviews path
      active: pathname === "/dashboard/library/reviews" && !isToolPage,
    },
  ];

  if (isToolPage) {
    breadcrumbs.push({
      label: selectedTool.title,
      active: true, // Only tool title is active
      onClick: () => {}, 
    });
  }

  return (
    <div className="flex items-center gap-1 mt-2 md:mt-5 mb-1">
      {breadcrumbs.map((crumb, index) => (
        <div className="flex items-center gap-1" key={index}>
          <span
            onClick={crumb.onClick}
            className={`${
              crumb.active
                ? "text-black"
                : "text-gray-500 hover:text-[#9013FE] cursor-pointer"
            }`}
          >
            {crumb.label}
          </span>
          {index < breadcrumbs.length - 1 && (
            <KeyboardArrowRightOutlinedIcon sx={{ color: "#6b7280" }} />
          )}
        </div>
      ))}
    </div>
  );
};
export default Breadcrumbs;