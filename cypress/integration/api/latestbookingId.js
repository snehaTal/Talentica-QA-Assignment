const { EndPoints, baseURL } = require("../../data/apiEndpoints");
const {
  PostReqBody,
  PutReqBody,
  AuthTokenBody,
  PutReqNegBody,
  PatchReqBody,
} = require("../../data/data");

describe("REST Assured approach API testing", () => {
  context("Given I have API healthcheck endpoint", () => {
    context("When I check if the API is up and running or not", () => {
      it("Then it should return the API health check success status", () => {
        cy.request({
          method: "GET",
          url: "https://restful-booker.herokuapp.com/ping",
        }).then((resp) => {
          expect(resp.status).to.eq(201);
        });
      });
    });
  });

  let authToken;
  context(
    "Given the API is up and running and I have user login credentials",
    () => {
      context("When I try to generate token to update system data", () => {
        it("Then it should create a new token and return token value", () => {
          cy.request({
            method: "POST",
            url: baseURL + EndPoints.auth,
            body: AuthTokenBody,
          }).then((resp) => {
            expect(resp.status).to.eq(200);
            expect(resp.body).to.have.property("token");
            authToken = resp.body.token;
          });
        });
      });
    }
  );

  context(
    "Given I have access to bookings page and the API is up and running",
    () => {
      context("When I navigate to bookings page", () => {
        it("Then I get all the bookings existing in the system", () => {
          cy.request({
            method: "GET",
            url: "https://restful-booker.herokuapp.com/booking",
          }).then((resp) => {
            expect(resp.body.length).greaterThan(0);
            expect(resp.body[0]).have.property("bookingid");
          });
        });

        context(
          "When I filter by first name & Last Name in the bookings page",
          () => {
            it("Then I get all the bookings existing in the system As per search filter", () => {
              cy.request({
                method: "GET",
                url: baseURL + EndPoints.booking,
                query: {
                  firstname: "Jim",
                  lastname: "brown",
                },
              }).then((resp) => {
                expect(resp.status).to.eq(200);
                expect(resp.body.length).greaterThan(0);
                expect(resp.body[0]).have.property("bookingid");
              });
            });
          }
        );

        context("When I filter by dates in the bookings page", () => {
          it("Then I get all the bookings existing in the system As per filter dates", () => {
            cy.request({
              method: "GET",
              url: baseURL + EndPoints.booking,
              query: {
                checkin: "2014-03-13",
                checkout: "2014-05-21",
              },
            }).then((resp) => {
              expect(resp.status).to.eq(200);
              expect(resp.body.length).greaterThan(0);
              expect(resp.body[0]).have.property("bookingid");
            });
          });
        });
      });

      context("When I click on a specific booking id", () => {
        it("Then I get all details for that Specific booking Id ", () => {
          cy.request({
            method: "GET",
            url: baseURL + EndPoints.booking + "/1",
          }).then((resp) => {
            expect(resp.status).to.eq(200);
            expect(resp.body).have.property("firstname");
          });
        });
      });

      let idvalue;
      context("When I Create New Booking in the system", () => {
        it("Then the new booking entry should be added in the system", () => {
          cy.request({
            method: "POST",
            url: baseURL + EndPoints.booking,
            body: PostReqBody,
            failOnStatusCode: false,
          }).then((resp) => {
            expect(resp.status).to.eq(200);
            expect(resp.body).to.have.property("bookingid");
            idvalue = resp.body.bookingid;
            expect(resp.body.booking.firstname).to.eq(PostReqBody.firstname);
            expect(resp.body.booking.lastname).to.eq(PostReqBody.lastname);
            expect(resp.body.booking.additionalneeds).to.eq(
              PostReqBody.additionalneeds
            );
            expect(resp.body.booking.depositpaid).to.eq(true);
            expect(resp.body.booking).to.deep.equal({
              firstname: PostReqBody.firstname,
              lastname: PostReqBody.lastname,
              totalprice: PostReqBody.totalprice,
              depositpaid: PostReqBody.depositpaid,
              bookingdates: {
                checkin: PostReqBody.bookingdates.checkin,
                checkout: PostReqBody.bookingdates.checkout,
              },
              additionalneeds: PostReqBody.additionalneeds,
            });
          });
        });
      });

      context(
        "When I Edit New Booking which i just created in the system",
        () => {
          it("Then the new booking entry should be Edited in the system", () => {
            cy.request({
              method: "PUT",
              url: baseURL + EndPoints.booking + "/" + idvalue,
              headers: {
                "Content-Type": "application/json",
                Cookie: "token=" + authToken,
              },
              body: PutReqBody,
              failOnStatusCode: false,
            }).then((resp) => {
              expect(resp.status).to.eq(200);
              expect(resp.body.firstname).to.eq(PutReqBody.firstname);
              expect(resp.body.lastname).to.eq(PutReqBody.lastname);
              expect(resp.body.additionalneeds).to.eq(
                PutReqBody.additionalneeds
              );
              expect(resp.body.depositpaid).to.eq(true);
            });
          });
        }
      );

      // Negative Case for PUT method i am passing only few fields it should return 400
      context("When I hit PUT request with only few fields", () => {
        it("Then I get 400 bad request error", () => {
          cy.request({
            method: "PUT",
            url: "https://restful-booker.herokuapp.com/booking/" + idvalue,
            headers: {
              "Content-Type": "application/json",
              Cookie: "token=" + authToken,
            },
            body: PutReqNegBody,
            failOnStatusCode: false,
          }).then((resp) => {
            expect(resp.status).to.eq(400);
          });
        });
      });

      context(
        "When I Partial Edit New Booking which i just created in the system",
        () => {
          it("Then the new booking entry should be Partial Edited in the system", () => {
            cy.request({
              method: "PATCH",
              url: "https://restful-booker.herokuapp.com/booking/" + idvalue,
              headers: {
                "Content-Type": "application/json",
                Cookie: "token=" + authToken,
              },
              body: PatchReqBody,
              failOnStatusCode: false,
            }).then((resp) => {
              expect(resp.status).to.eq(200);
              expect(resp.body.firstname).to.eq(PatchReqBody.firstname);
              expect(resp.body.lastname).to.eq(PatchReqBody.lastname);
              expect(resp.body.depositpaid).to.eq(true);
            });
          });
        }
      );

      context(
        "When I Delete New Booking which i just created in the system",
        () => {
          it("Then the new booking entry should be Deleted in the system", () => {
            cy.request({
              method: "DELETE",
              url: "https://restful-booker.herokuapp.com/booking/" + idvalue,
              headers: {
                "Content-Type": "application/json",
                Cookie: "token=" + authToken,
              },
            }).then((resp) => {
              expect(resp.status).to.eq(201);
              expect(resp.body.firstname).not.to.eq(PutReqBody.firstname);
              expect(resp.body.lastname).not.to.eq(PutReqBody.lastname);
            });
          });
        }
      );
    }
  );
});
