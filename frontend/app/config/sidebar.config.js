const roles = ["project-officer"]
const SidebarConfig = {
  roles: {
    'project-officer': {
      title: roles[0],
      profileImg:"/images/logo.png",
      officerName:"Ali Arzan Zaidi",
      Logout: { name: "LogOut", url: `${roles[0]}/logout`, icon: "➜]" },
      role: "Project Officer",
      tabs: [
        { name: "Dashboard", url: `/roles/${roles[0]}/` ,icon:"📊"},
        { name: "My Project", url:`/roles/${roles[0]}/my-project`,icon:"🗂️"},
        { name: "Create Project", url: `/roles/${roles[0]}/create-project`,icon:"➕"},
        { name: "Notification", url:`/roles/${roles[0]}/notification`,icon:"🔔"},
        { name: "Setting", url:`/roles/${roles[0]}/settings`,icon:"⚙️"},
      ],
    },
  },
};

export default SidebarConfig;