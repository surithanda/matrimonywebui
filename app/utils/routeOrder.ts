const routeOrder = [
  '/createprofile',
  '/createprofile/primarycontact',
  '/createprofile/education',
  '/createprofile/employment',
  '/createprofile/hobbies',
  '/createprofile/lifestyle',
  '/createprofile/family',
  '/createprofile/references',
  '/createprofile/property',
  '/createprofile/photos',
  '/createprofile/partner'
];

export const getNextRoute = (currentRoute: string): string => {
  const currentIndex = routeOrder.indexOf(currentRoute);
  if (currentIndex === -1 || currentIndex === routeOrder.length - 1) {
    return routeOrder[0]; // Return to start if not found or at end
  }
  return routeOrder[currentIndex + 1];
};
