const HeaderConfig = {
  roles: {
    'project-officer': {
      title: "projectOfficer",
      profileImg: "/images/projectOfficer.jpg",
      officerName: "Ali Arzan Zaidi",
      logout: { name: "LogOut", url: "/roles/project-officer/logout", icon: "➜" },
      role: "Project Officer",
      state: "Delhi",
      district: "Ujwa",
    },
    'LandAcqOfficer': {
      title: "LandAcqOfficer",
      profileImg: "/images/LAOfficer.jpg",
      officerName: "Khalid Umar",
      logout: { name: "LogOut", url: "/roles/LandAcqOfficer/logout", icon: "➜" },
      role: "Land Acquisition Officer",
      state: "Delhi",
      district: "Ujwa",
    },
  },
};

export default HeaderConfig;