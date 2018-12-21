"use strict";

const fs = require("fs");

const expect = require("chai").expect;
const parseRDF = require("../lib/parse-rdf.js");
const rdf = fs.readFileSync(`${__dirname}/pg132.rdf`);

describe("parseRDF", () => {
  it("一个函数", () => {
    expect(parseRDF).to.be.a("function");
  });
  it("rdf的内容", () => {
    const book = parseRDF(rdf);
    expect(book).to.be.a("Object");
    expect(book).to.have.property("id", 132);
    expect(book).to.have.property("title", "The Art of War");
    expect(book)
      .to.have.property("authors")
      .that.is.an("array")
      .with.lengthOf(2)
      .and.contains("Sunzi, active 6th century B.C.")
      .and.contains("Giles, Lionel");
    expect(book)
      .to.have.property("subjects")
      .that.is.an("array")
      .with.lengthOf(2)
      .and.contains("Military art and science -- Early works to 1800")
      .and.contains("War -- Early works to 1800");
  });
});
