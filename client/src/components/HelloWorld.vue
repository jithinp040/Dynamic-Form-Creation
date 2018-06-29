<template>
  <div id="hello">
    <div class="modal is-active">
      <div class="modal-background"></div>

    <div class="modal-card has-background-grey">
     <header class="modal-card-head"> 
       <label class="label  has-text-size-bold is-centered modal-card-title">Dynamic-Input-Form</label>
     </header>
    <!-- The Component Starts From here -->
<section class="modal-card-body">
  <!--This type of data binding is easily possible because of its ability to
     bind an attribute dynamically with the "v-bind" attribute -->

    <!--Here setting the index is important because this allows future changes
     where the data corresponds to the name of the field only and not its order -->
    <div v-for="(data,no) in fields" :index="fields.id">
      <!-- Renders the fields one by one in a loop -->
      <label class="label has-background-info has-text-white has-text-size-bold ">{{data.label}}</label><!--Shows the label of the field-->
      <div v-for="(dat,nos) in data.option">
        <!-- This loop is used for displaying the options available to that loop if present(used mainly for radio,checkboxes and select box)-->
      <div class="field" v-if="data.type==='radio'">
        <!--The data executes only if the condition gets to true -->
        <!--For radio ,we need to write the options as a text after the input field,setting it inside loop wont help-->
        <input class="is-checkradio" v-model="database[no].value" :type="data.type" :name="dat" :value="dat" :label="dat" >{{dat}}</div>
      <div v-else-if="data.type==='checkbox'">
        <!--The checkbox follows the same theorey as the radio button -->
        <input class="is-checkradio" v-model="database[no].value" :type="data.type" :name="dat" :value="dat" :label="dat" >{{dat}}</div>
      <div v-else-if="data.type==='email'">
        <!--These are basic data -->
        <input class="input is-rounded is-info" v-model="database[no].value" :type="data.type" :name="dat" :value="dat" :label="dat" ></div>
        <div v-else-if="data.type==='password'">
        <input class="input is-rounded is-info" v-model="database[no].value"  :type="data.type" :name="dat" :value="dat" :label="dat" ></div>
      <div v-else-if="data.type==='date'">
        <input class="input is-rounded is-info" v-model="database[no].value"  :type="data.type" :name="dat" ></div>
      <div v-else-if="data.type=='file'"><!--This is image uploading (not a file upload) -->
        <div v-show="lab">
        Which are you going to use:Webcam or File<br><button @click="webcam()" class="button is-info has-text-white">Take Photo</button>
        <!--The upload button processing goes here (For appearence The input is hidden and is filled out with a label)
        Tried to use a button here but ended up with bugs-->
        <input class="input-file"  @change="fileup(no)" :type="data.type" :name="dat" ></div><img :src="database[no].value" v-show="database[no].status">
        <!--The popup window with the webcam support is used here-->
        <!--The usage of the "div class =modal" gives the code a basic view of a popup(just increased its z-index value)--> 
        <div v-show="web" id="webc" class="modal"><div class=modal-content> <video v-show="chek" ref="video" id="video" width="320" height="240" autoplay></video><br>
        <button v-show="chek" style="text-align:center
        " @click="capture(no)">Take Photo</button>
        <canvas ref="canvas" v-show="!chek" width="320" height="240"></canvas><br><!--One which prints a image with the help of a video-->
        <button v-show="!chek" @click="webstop(no)">OK</button><!--Buttons for setting the image-->
        <button v-show="!chek" @click="chek=true">Cancel</button></div></div></div>
      <div v-else-if="data.type==='time'">
        <input class="input is-rounded is-info" v-model="database[no].value" @change=show(no) :type="data.type" :name="dat" ></div>
    <!--Experimental Used to set values with the help of buttons -->
    <!--  <div class="container inline justify-center" v-else-if="data.type==='button'">
        <button @click=ye(nos,no) class="q-btn bg-primary text-white q-pa-md justify-center">{{dat}}</button></div>-->
      
      
      <select class="select" v-model="database[no].value" v-else-if="data.type==='select'&&nos===0" ><option v-for="(opt) in data.option" >{{opt}}</option></select>
      <!--Here notice the usage of && in this ,This is used because normally the select 
      bceause there are options present inside it ,it gets printed thrice.This is avoided by putting no==0,which tells to print only onceand in first position available-->
      <div v-else-if="data.type==='text'&&no==0"><!--The no==0Here is used  to set it as the autocomplete form -->
        <input class="input is-rounded is-info" :type="data.type" list="std names" @input="autoc()" @keyup.enter="check()" :placeholder="data.label" v-model="database[no].value" >
        <datalist class=select id="std names"><!-- The datalist acts as a autocomplete suggestion box shows the suggestion as a list of options-->
          <option v-for="(queries,n) in query" @choice="check()" v-bind:value="queries.fname"  v-bind:label="queries.fname"></option>
        </datalist>
        </div>
        <div v-else-if="data.type==='text'">
        <input class="input is-rounded is-info" :type="data.type" @input="show(no)" :placeholder="data.label" v-model="database[no].value" >
        </div>
        <!--Since textarea is initialized with different syntax we only use it in the "if" attrib-->
      <textarea class="textarea is-info" v-else-if="data.type==='textarea'" v-model="database[no].value" :placeholder="data.label" ></textarea>
      </div>
    </div>
    <div class="row justify-center">
      <!---Finishing the database with the save and delete options-->
    <button @click="saveit()" class="button is-success has-text-white has-text-size-bold" >Submit</button>
    <button v-show="del" @click="deleteit()" class="button is-danger has-text-white has-text-size-bold" >Delete</button></div>
</section>
    </div>
    </div>
</div>
</template>

<script>
var axios=require('axios'); //Used to post request to server
var router=require('vue-router'); //Used for connecting pages in the client
var Vue=require('vue').default; //Basic vue functionality
Vue.use(router);//Tells it to use the router(Used for Multiple Page Application)
import "bulma/css/bulma.css"
import "bulma-extensions/bulma-checkradio/dist/css/bulma-checkradio.min.css"
export default {
  data() {
    return {
      fields: [],//Holds the no. and type of fields
      database: [],//Where the data is stored to be sent to server
      val: [],//Contains the options if present for the field(checkbox,selectbox,etc)
      query: [],//Holds the data for the autocomplete form
      del: false,//To give the delete ooption to the user
      lab: true,//Used for showing labels in image uploading
      video: {},//Used to hold the data of the video component for easy processing(plays the webcam)
      canvas: {},//Used to hold the data of the canvas component for easy processing(takes the video as a canvas and redraws it as a picture)
      web: false,//Used for displaying a popup window(Sucks to say,but this is done entirely with css)
      st:{},//Used to hold the stream data for webcam(to stop or start webcam)
      chek:true//Just used to display the buttons in the webcam popup
    };
  },
  mounted() {//This runs as the page loads

  /*Note that mounted does not guarantee that all child components have also been mounted. If you
  want to wait until the entire view has been rendered, you can use vm.$nextTick inside of mounted:
  However this doesnt work in server side rendering*/
    axios.get("http://localhost:8081/fields").then(response => {
      this.fields = response.data;
//Here the values are stored in a array becuase of the complications that occur while using a checkbox or Radio
      console.log(this.fields);
      for (var i = 0; i < this.fields.length; i++) {//Creating variables for storing data
        if (this.fields[i].type == "button") {//Runs if a file is loaded
          this.database.push({ key: this.fields[i].id, value: false });
        } else if (this.fields[i].type == "file") {
          this.database.push({
            key: this.fields[i].id,
            value: [],
            status: false
          });
        } else this.database.push({ key: this.fields[i].id, value: [] });
      }
    });
  },
  methods: {

    //This is used just for testing
    /*show(id) {
      console.log(id);
      console.log(this.fields[id].option);
      console.log(this.database[id].value);
    },
    //This is a experimental feature where a button is used as a value for updation(here i used boolean values
    integer calculation can also be done here)
    ye(res, id) {
      if (res == 0) {
        this.database[id].value = true;
      }
      if (res == 1) {
        this.database[id].value = false;
      }
      console.log(this.database[id].value);
    },*/
    saveit() {//Used to Save or Update the database with the entire data
    //Here we use two database (one for the names and the other with Values) 
      let finuser = this.database;
      console.log(finuser);
      
      if (this.query[0] !== undefined) {//This part is used to check if any data exist in autoc section
        console.log(this.query[0]);//If that is true then it checks the second condition
        if (this.query[0].fname == this.database[0].value) {//Used in case if the name is incomplete Just for safety
          axios//Here updation of data occurs
            .put("http://localhost:8081/update", {
              params: { id: this.query[0].id },
              data: finuser
            })
            .then(response => {
              console.log(response.data);
            })
            .catch(err => {
              console.log(err);
            });
        }
      } else {//Here insertion of data occurs here
        axios.post("http://localhost:8081/save", finuser).then(response => {
          console.log(response.data);
        });
      }
    },
    autoc() {
      //Used as the autocomplete form where name of students is obtained
      axios
        .get("http://localhost:8081/autoc/", {
          params: { name: this.database[0].value }
        })
        .then(response => {
          this.query = response.data.data;
          console.log(this.query);
        });
    },
    check() {//Fill the empty fields with the details of the person entered
      if (this.query[0].fname == this.database[0].value) {//Used because,if ignored wrong data will get placed in field or it will unneccessary errors
        this.del = true;
        axios
          .get("http://localhost:8081/getit/", {
            params: { id: this.query[0].id }//Used to get the specific object
          })
          //Just found a awesome bug here,this wasnt declared but it works perfectly(Don't know why)
          .then(response => {
            this.datas = response.data.data;
            for (var i = 0; i < this.datas.length; i++) {//Takes one data from the query result
              for(var j=0;j<this.database.length;j++){//Parses all the fields of the form
              if (this.datas[i].fieldid == this.database[j].key) {//Pastes only if the fieldid is equal to the key value 


              //Here we use RegEx a global language supported by many programming languages (It eases the work of user for searching or replacing strings
              //And also can be used in if condition by using the syntax (/RegEx/.test(String Name))  )
                if (/^data/.test(this.datas[i].value)) {
                  this.database[j].status = true;//To make sure that the image is displayed
                  this.lab = false;
                  var binary = ""; //Here decoding of data takes place
                  var bytes = new Uint8Array(this.datas[i].value); //Stores the data as a array which consist of unicode data
                  var len = bytes.byteLength; //Get the total length of the array
                  for (var k = 0; k < len; k++) {
                    //In the loop get the corressponding ASCII code of the byte array present there,add it to string
                    binary += String.fromCharCode(bytes[k]);
                  }
                  this.database[j].value = binary; //set converted string to image
                }
                this.database[j].value = this.datas[i].value;
              }
              }
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    deleteit() {//Used to Delete the record
      axios
        .delete("http://localhost:8081/delete/", {
          params: { id: this.query[0].id }
        })
        .then(response => {
          console.log(response);
          alert("Data deleted successfully",()=>{location.reload()})
        })
        .catch(error => {
          console.log(error);
        });
    },
    fileup(id) {
      //The encoding of the image occurs here
      var bas; //Holds the encoded data
      var reader = new FileReader(); //Used to read the file
      console.log(this.database);
      var vm = this; // *** This is important because this is used to refer the base class,here it is the entire vue function ***

      let file = event.target.files[0]; //Here the image data is referenced to another variable for easy access
      console.log(file);
      reader.readAsDataURL(
        file
      ); /***This is used to read the file as a dataURL which is a conversion of the data to base64 no other work is neccessary
      Base64 is a encoded format of the image which is used for passing image data to a database easily ,but it takes extra size
      necessary for database uploading*/
      console.log(vm.database);
      reader.onload = function(rd) {
        //After the file is loaded
        bas = rd.target.result; //copying of data to image and setting visiblity of image to true
        //Using this here will only give scope access of fileup() method,using vm here will give scope to entire program
        vm.database[id].value = bas;
        vm.database[id].status = true;
        console.log(vm.database);
        vm.lab = false;
      };
    },
    webcam() {//Used to start the webcam interface
      this.web = true;
      this.video = this.$refs.video;//This is a easy version of document.getElementByID/class (or) query selector
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {//One fo the basic properties of the internet
      //This contains the details of entire device like devices attached to it and events to be performed on plug and play
      //First part is a check for devices connected to it ,Second one checks whether if it is a type of webcam
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {//Used to allow device to take video only,for audio along with it set its boolean to true inside the object 
          this.video[0].src = window.URL.createObjectURL(stream);//The webcam shows obtained data as it is,so it is a video,the src of the video is set to one created by webcam stream
          this.st=stream//This part is done so that one could control the webcam
          //this.video[0].play();//this code is only neccessary when autoplay option is not set in html 
        });
      }
    },
      webstop(id){//Used when the photo is okay and is set to be the data also stops WebCam
        this.web=false;
        this.database[id].value = this.canvas[0].toDataURL("image/jpeg");//Converts the obtained image from canvas to a data url(toDataURL seems to be a global object)
        console.log(this.database[id])
        this.database[id].status=true//Displays the image on form
        this.lab=false//Contains the page of image uploading ,a popup window(which is done entirely with help of css)
        //stop() is deprecated in google chrome latest version
        //Here we get the list of tracks present in the stream and stop them
        //The variable st contains the streaming of the webcam
        //Since we have only one video(ie webcam),we select the stream and stop it
        //In case of multiple webcams (conference)USE: along with getTracks ,forEach(function (track) {track.stop();
        this.st.getVideoTracks()[0].stop()
      },
    capture() {//Used to take a picture with the webcam
      this.canvas = this.$refs.canvas;//The $ref only work when the component is also given the reference (ref=refid)
      //The ref id is accessed with $refs.refid
      //Each must have a unique refid
      var context = this.canvas[0]//This may vary (Not sure why)
        .getContext("2d")//Defines type of image to be obtained
        .drawImage(this.video[0], 0, 0, 320, 240);//Redraws the image on a canvas where the starting position and size of image is provided 
        this.chek=false//Used for presentation of objects
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
textarea {
  height: 100px;
  width: 100%;
}
input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
}
select {
  width: 30%;
  text-align: center;
}
input[type="date"],
input[type="time"] {
  width: 30%;
}
button {
  display: inline;
}
.label{

  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif
}

.modal-card-title{
font-family: Verdana, Geneva, Tahoma, sans-serif
}
</style>



