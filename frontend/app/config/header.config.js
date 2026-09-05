const roles = ["project-officer"]
const HeaderConfig = {
  roles: {
    'project-officer': {
      title: roles[0],
      profileImg:"/images/logo.png",
      officerName:"Ali Arzan Zaidi",
      Logout: { name: "LogOut", url: `${roles[0]}/logout`, icon: "➜]" },
      role: "Project Officer",
    },
  },
};

export default HeaderConfig;