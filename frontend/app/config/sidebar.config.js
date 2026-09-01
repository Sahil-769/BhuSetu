const roles = ["projectOfficer"]
const SidebarConfig = {
  roles: {
    admin: {
      title: roles[0],
      profileImg:"/images/logo.png",
      officerName:"Ali Arzan Zaidi",
      Logout: { name: "LogOut", url: `${roles[0]}/logout`, icon: "➜]" },
      role: "Project Officer",
      tabs: [
        { name: "Dashboard", url: `/roles/${roles[0]}/` ,icon:"📊"},
        { name: "Create Project", url: `/roles/${roles[0]}/create-project`,icon:"➕"},
        { name: "My Project", url:`/roles/${roles[0]}/my-project`,icon:"🗂️"},
        { name: "GIS", url: `/roles/${roles[0]}/gis`,icon:"🌏"},
      ],
    },
  },
};

export default SidebarConfig;