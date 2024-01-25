<script setup lang="ts">
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { onMounted } from 'vue';




onMounted(() => {
	 new Tabulator('#example-table', {
    data:[
 	{id:1, name:"Oli Bob", age:"12", col:"red", dob:""},
 	{id:2, name:"Mary May", age:"1", col:"blue", dob:"14/05/1982"},
 	{id:3, name:"Christine Lobowski", age:"42", col:"green", dob:"22/05/1982"},
 	{id:4, name:"Brendon Philips", age:"125", col:"orange", dob:"01/08/1980"},
 	{id:5, name:"Margret Marmajuke", age:"16", col:"yellow", dob:"31/01/1999"},
 ], columns:[ //Define Table Columns
	 	{title:"Name", field:"name", width:150},
	 	{title:"Age", field:"age", hozAlign:"left", },
	 	{title:"Favourite Color", field:"col"},
	 	{title:"Date Of Birth", field:"dob" },
 	],
})

})

</script>
<template>
    <div>
		<div id="example-table"></div>
    </div>
</template>
<style></style>