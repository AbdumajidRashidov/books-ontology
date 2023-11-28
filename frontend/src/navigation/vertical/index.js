const navigation = () => {
  return [
    {
      title: 'Home',
      icon: 'mdi:home-outline',
      path: '/home'
    },
    {
      title: 'Search',
      icon: 'mdi:magnify',
      path: '/search'
    },
    {
      title: 'My Shelf',
      icon: 'mdi:book-open-page-variant-outline',
      path: '/my-shelf'
    },
    {
      title: 'Contribute',
      icon: 'mdi:hand-heart-outline',
      path: '/contribute'
    },
    {
      title: 'Chat AI',
      badgeContent: 'new',
      badgeColor: 'success',
      icon: 'mdi:message-outline',
      path: '/apps/chat'
    }
  ]
}

export default navigation
