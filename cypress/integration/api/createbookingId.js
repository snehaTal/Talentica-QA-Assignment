describe("API Test", () => {
  it("Verify response and status--GET", () => {
    cy.request({
      method: "GET",
      url: "https://restful-booker.herokuapp.com/booking/1",
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("firstname");
      expect(response.body).to.have.property("depositpaid");
      expect(response.body).to.have.property("lastname");
      expect(response.body).to.have.property("totalprice");
      expect(response.body).to.have.property("bookingdates");
      expect(response.body).to.have.property("additionalneeds");
    });
  });
});
