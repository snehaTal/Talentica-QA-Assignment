export const AuthTokenBody = { username: "admin", password: "password123" };

export const PostReqBody = {
  firstname: "Kelvin",
  lastname: "May",
  totalprice: 111,
  depositpaid: true,
  bookingdates: {
    checkin: "2018-01-01",
    checkout: "2019-01-01",
  },
  additionalneeds: "Breakfast",
};

export const PutReqBody = {
  firstname: "Jhones",
  lastname: "Brown",
  totalprice: 111,
  depositpaid: true,
  bookingdates: {
    checkin: "2018-01-01",
    checkout: "2019-01-01",
  },
  additionalneeds: "Breakfast",
};

export const PutReqNegBody = {
  firstname: "Snehal",
  lastname: "Patil",
};

export const PatchReqBody = {
  firstname: "Seema",
  lastname: "Brown",
  bookingdates: {
    checkin: "2018-01-01",
    checkout: "12-12-2019",
  },
};
