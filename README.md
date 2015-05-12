# When AMD loader plugin
 
Allows modules to resolve asynchronously via promises that have the done/fail callbacks (e.g. jQuery's Deferred).

Promise can be a property in the module, or value returned from a function in a module, or the module itself.

The syntax is:
`when!path/to/module[.property]`

where .property is optional and can be a promise or a function that returns a promise.
If the property is not defined then the module itself should return a promise or a function that returns a promise.

Once the promises is resolved this plugin loads the module (so not the property).
