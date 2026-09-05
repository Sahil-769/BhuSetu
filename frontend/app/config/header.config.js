const roles = ["projectOfficer"]
const HeaderConfig = {
  roles: {
    admin: {
      title: roles[0],
      // profileImg:"/images/projectOfficer.jpg",
      profileImg:"/images/logo.png",
      officerName:"Ali Arzan Zaidi",
      Logout: { name: "LogOut", url: `${roles[0]}/logout`, icon: "➜]" },
      role: "Project Officer",
      // state: "Uttar Pardesh",
      // officerId :"PS1230",
      // district:"Pratapgarh",
    },
        admin: {
      title: roles[1],
      // profileImg:"/images/projectOfficer.jpg",
      profileImg:"/images/logo.png",
      officerName:"Ali Arzan Zaidi",
      Logout: { name: "LogOut", url: `${roles[0]}/logout`, icon: "➜]" },
      role: "Land Acquisition Officer",
      // state: "Uttar Pardesh",
      // officerId :"PS1230",
      // district:"Pratapgarh",
    },
  },
};

export default HeaderConfig;