const dealExists = async (cart, dealId) => {
  for (var item of cart) {
    if (item.deal.equals(dealId)) return true;
  }
  return false;
};
