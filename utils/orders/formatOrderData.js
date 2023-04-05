 const formatOrderData = (orders) => {
  const ordersInformation = [];
  for (const order of orders) {
    let currOrder = {};
    if (!order.profileId) {
      currOrder = {
        clientInfo: {
          firstName: order.firstName,
          lastName: order.lastName,
          email: order.email,
          city: order.city,
          country: order.country,
          phone: order.phoneNumber,
          unitNumber: order.unitNumber,
          street: order.street,
        },
        orderInfo: {
          productsOrdered: order.productsOrdered,
          orderStatus: order.orderStatus,
          orderId: order._id,
        },
      };
    }
    if (order.profileId) {
      currOrder = {
        clientInfo: {
          firstName: order.profileId.firstName,
          lastName: order.profileId.lastName,
          email: order.profileId.email,
          city: order.profileId.city,
          country: order.profileId.country,
          phone: order.profileId.phoneNumber,
          unitNumber: order.profileId.unitNumber,
          street: order.profileId.street,
        },
        orderInfo: {
          productsOrdered: order.productsOrdered,
          orderStatus: order.orderStatus,
          orderId: order._id,
        },
      };
    }
    ordersInformation.push({ ...currOrder });
  }
  return ordersInformation;
};

module.exports =  formatOrderData