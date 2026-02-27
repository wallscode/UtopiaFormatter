---
id: Uto-1lss
status: closed
deps: []
links: []
created: 2026-02-27T21:05:01Z
type: feature
priority: 2
tags: [parser, province-logs]
---
# Province Logs parser: handle "Lord Benni, to explore N acres, we have sent out an ..."

Unrecognized line reported 3 time(s) in context: province-logs.

Example line:
  Lord Benni, to explore 10 acres, we have sent out an expedition of 90 soldiers at a cost of 29,240 gold coins. We expect all of the land to be settled by July 10 of YR8.

Normalised pattern:
  Lord Benni, to explore N acres, we have sent out an expedition of N soldiers at a cost of N,N gold coins. We expect all of the land to be settled by July N of YRN.

`logUnrecognizedLine()` is already instrumented at the call site.
This is a parsing gap to fill — add a handler for this line format.

This line is an order to explore land, which is a construction order and should be included in the construction summary and explored land summary.  Keep track of the total number of acres explored and the total number of soldiers sent out as well as the cost of the expedition.  By default only include the total number of acres explored but in advanced mode give an option to include the total number of soldiers sent out and the cost of the expedition.

