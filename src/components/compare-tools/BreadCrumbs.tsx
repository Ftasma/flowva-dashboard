import { useNavigate, useLocation } from "react-router-dom";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";

const Breadcrumbs = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const breadcrumbs = [
    {
      label: "Library",
      onClick: () => {
        navigate("/dashboard/library");
      },
      // Only active when NOT on tool page and exactly at library
      active: pathname === "/dashboard/library",
    },
    {
      label: "Compare",
      active: pathname === "/dashboard/library/compare",
    },
  ];

  return (
    <div className="flex items-center gap-1 mt-2  mb-1">
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
