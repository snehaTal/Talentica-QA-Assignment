import { PostReqBody } from "../../data/data";

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
                url: "https://restful-booker.herokuapp.com/booking",
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
              url: "https://restful-booker.herokuapp.com/booking",
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
            url: "https://restful-booker.herokuapp.com/booking/1",
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
            url: "https://restful-booker.herokuapp.com/booking",
            body: PostReqBody,
          }).then((resp) => {
            expect(resp.status).to.eq(200);
            expect(resp.body).to.have.property("bookingid");
            idvalue = resp.body.bookingid;
            expect(resp.body.booking.firstname).to.eq(PostReqBody.firstname);
            expect(resp.body.booking.lastname).to.eq(PostReqBody.lastname);
            expect(resp.body.booking.additionalneeds).to.eq("Breakfast");
            expect(resp.body.booking.depositpaid).to.eq(true);
            expect(resp.body.booking).to.deep.equal({
              firstname: "Kelvin",
              lastname: "May",
              totalprice: 111,
              depositpaid: true,
              bookingdates: {
                checkin: "2018-01-01",
                checkout: "2019-01-01",
              },
              additionalneeds: "Breakfast",
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
              url: "https://restful-booker.herokuapp.com/booking/" + idvalue,
              headers: {
                Authorization: "Basic YWRtaW46cGFzc3dvcmQxMjM=",
                "Content-Type": "application/json",
              },
              body: {
                firstname: "Jhones",
                lastname: "Brown",
                totalprice: 111,
                depositpaid: true,
                bookingdates: {
                  checkin: "2018-01-01",
                  checkout: "2019-01-01",
                },
                additionalneeds: "Breakfast",
              },
            }).then((resp) => {
              expect(resp.status).to.eq(200);
              expect(resp.body.firstname).to.eq("Jhones");
              expect(resp.body.lastname).to.eq("Brown");
              expect(resp.body.additionalneeds).to.eq("Breakfast");
              expect(resp.body.depositpaid).to.eq(true);
            });
          });
        }
      );

      context(
        "When I Partial Edit New Booking which i just created in the system",
        () => {
          it("Then the new booking entry should be Partial Edited in the system", () => {
            cy.request({
              method: "PATCH",
              url: "https://restful-booker.herokuapp.com/booking/" + idvalue,
              headers: {
                Authorization: "Basic YWRtaW46cGFzc3dvcmQxMjM=",
                "Content-Type": "application/json",
              },
              body: {
                firstname: "Seema",
                lastname: "Brown",
              },
            }).then((resp) => {
              expect(resp.status).to.eq(200);
              expect(resp.body.firstname).to.eq("Seema");
              expect(resp.body.lastname).to.eq("Brown");
              expect(resp.body.additionalneeds).to.eq("Breakfast");
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
                Authorization: "Basic YWRtaW46cGFzc3dvcmQxMjM=",
                "Content-Type": "application/json",
              },
            }).then((resp) => {
              expect(resp.status).to.eq(201);
              expect(resp.body.firstname).not.to.eq("Jhones");
              expect(resp.body.lastname).not.to.eq("Brown");
            });
          });
        }
      );
    }
  );
});
