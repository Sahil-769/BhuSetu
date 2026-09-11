const roles = ["project-officer","LandAcqOfficer","nodal-officer"]
const SidebarConfig = {
  roles: {
    'project-officer': {
      title: roles[0],
      profileImg: "/images/logo.png",
      officerName: "Khalid Umar",
      logout: { name: "LogOut", url: `/roles/${roles[0]}/logout`, icon: "➜" },
      role: "Project Officer",
      tabs: [
        { name: "Dashboard", url: `/roles/${roles[0]}/`, icon: "📊" },
        { name: "My Project", url: `/roles/${roles[0]}/my-project`, icon: "🗂️" },
        { name: "Create Project", url: `/roles/${roles[0]}/create-project`, icon: "➕" },
        { name: "Notificatiion", url: `/roles/${roles[0]}/notification`, icon: "🔔" },
      ],
    },
    'LandAcqOfficer': {
      title: roles[1],
      profileImg: "/images/logo.png",
      officerName: "Ali Arzan Zaidi",
      logout: { name: "LogOut", url: `/roles/${roles[1]}/logout`, icon: "➜" },
      role: "Land Acquisition Officer",
      tabs: [
        { name: "dashboard", url: `/roles/${roles[1]}/`, icon: "📊" },
        { name: "My Assigned Projects", url: `/roles/${roles[1]}/my-project`, icon: "📁" },
        { name: "Parcel Verification", url: `/roles/${roles[1]}/parcels`, icon: "🗺️" },
        { name: "Acquisition Cases", url: `/roles/${roles[1]}/acquisition-cases`, icon: "📋" },
        { name: "Map View", url: `/roles/${roles[1]}/gis`, icon: "📍" },
        { name: "Notifications", url: `/roles/${roles[1]}/notification`, icon: "🔔" },
        { name: "Reports", url: `/roles/${roles[1]}/gis`, icon: "📊" },
        { name: "Settings", url: `/roles/${roles[1]}/settings`, icon: "⚙️" },
      ],
    },
    'nodal-officer': {
      title: roles[2],
      profileImg: "/images/logo.png",
      officerName: "Sahil Alvi",
      logout: { name: "LogOut", url: `/roles/${roles[2]}/logout`, icon: "➜" },
      role: "Nodal Officer",
      tabs: [
        { name: "dashboard", url: `/roles/${roles[2]}/`, icon: "📊" },
        { name: "Projects", url: `/roles/${roles[2]}/projects`, icon: "📁" },
        { name: "Risk Map", url: `/roles/${roles[2]}/risk-map`, icon: "🚨" },
        { name: "Analytics", url: `/roles/${roles[2]}/analytics`, icon: "🎯" },
        { name: "Notifications", url: `/roles/${roles[2]}/notification`, icon: "🔔" },
      ],
    },
  },
};

export default SidebarConfig;