var express = require('express') //basic webserver app,like bootstrap for html
var app = express() //using it as a variable
var mysql = require('mysql') //for mysql connection
var connect = require('express-myconnection') //For auto close and open of database

var config = require('./config.js')//This is not necessary but for global use this is a good pratice
var dbopt = {
    host: config.host,
    database: config.db,
    user: config.user,
    password: config.password,

}
app.use(connect(mysql, dbopt, 'pool')) //connecting the database

//body-parser extract the entire body portion of an incoming request stream and exposes it on  req.body
var bodyp = require('body-parser')
/**
 * bodyParser.urlencoded() parses the text as URL encoded data 
 * (which is how browsers tend to send form data from regular forms set to POST) 
 */
//It doesnt handle multipart forms
app.use(bodyp.urlencoded({
    extended: true
}))
//Returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option
app.use(bodyp.json())

//This is important step in allowing connection between server and client
//enable CORS methods in response(res) of the server in its headers 
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/*  This syntax can be used if the data is set in different files ,this causes reduced loading
var index = require('./routes/index')
var users = require('./routes/users')
app.use('/', index)
app.use('/users', users)
*/
app.get('/autoc', function(req, res, next) {//Used to get data for the autocomplete form
	let name=req.query.name//obtain the name from the params
	req.getConnection(function(error, conn) {//Get a connection to db and ask the query
		conn.query("SELECT * FROM name WHERE fname LIKE '"+name+"%'",function(err, rows, fields) {
			//if(err) throw er
			if (err) {
				console.log(err)
				res.json([{
					data: ''
				}])
			} else {
				console.log(rows)
				res.json({
					data: rows
				})
			}
		})
	})
})
app.get('/getit', function(req, res, next) {//Obatin the field's data
//In the database ,the data is stored as a blob
//The database does it by itself(Thank God)so no encoding is required
//The blob data is typecasted as string for reading with the help of "cast(field as type)" 
//Changing the name of the obtained value will be good otherwise we will get a 
//unneccessary field name.Done with the help of "originalname as newname"
	let id=req.query.id
	console.log(id)
	req.getConnection(function(error, conn) {
		conn.query("SELECT id,cast(value as char)  as value,ofname,fieldid FROM dat WHERE ofname="+id,function(err, rows, fields) {
			//if(err) throw er
			if (err) {
				console.log(err)
				res.json([{
					data: ''
				}])
			} else {
				console.log(rows)
				res.json({
					data: rows
				})
			}
		})
	})
})


app.put('/update',function(req,res,next){//Used to update the database values
    var id=req.body.params.id
    var user=[]
    req.getConnection(function(error, conn) {
        for(i=1;i<req.body.data.length;i++){//Here i use from 1 because we need to update from last name
            //Pass data to array and pass it to stored procedure
            user =[req.body.data[i].value,req.body.data[i].key,req.body.params.id]
            console.log(user)
            conn.query("CALL insd(?,?,?)",user,function(err,rows,fields){
                if(err){
                    console.log(err);
                    res.json({data:('ErrorOccured')})
                }else{
                    console.log(rows)
                }
            })
            }res.json({data:"Data updated Successfully"})
         })
        })

app.delete('/delete',function(req,res,next){//Used to delete a record
    let id=req.query.id
    console.log(id)
    var sql
    req.getConnection(function(error, conn) {
                console.log(req)
                conn.query("CALL deld(?)",id,function(err,rows,fields){
                    if(err){
                        console.log(err);
                        res.json({data:('ErrorOccured')})
                    }else{
                        console.log(rows)
                    }res.json({data:"Data Deleted Successfully"})
                    })
                
                })
            })

function st(iid,req){//Insert values(part2 of insertion)
    req.getConnection(function(error, conn) {
    for(i=1;i<req.body.length;i++){console.log(req.body[i])
		conn.query("INSERT INTO dat (value,ofname,fieldid) VALUES ('"+req.body[i].value+"',"+iid+","+req.body[i].key+")",function(err,rows,fields){
            if(err){
                console.log(err);
                res.json({data:('ErrorOccured')})
            }else{
                console.log("Data Uploaded")
            }
        })
        }
        })
    }


app.post('/save', function (req, res, next) {//Insert values (part1 of insertion)
   var usern=req.body[0].value
   var iid
    req.getConnection(function (err, conn) {
        var vm=this
        conn.query("call insn(?)",usern, function (err, rows, fields) {
            if (err) {
                console.log(err);
                res.json({
                    data: ('ErrorOccured')
                })
            }else{
                vm.iid=rows[0][0].id
                st(vm.iid,req)
                res.json(("Data Uploaded Successfully"))
            }
            })
            
    })
}) 
app.get('/fields', function (req, res, next) {//Runs at start of program
    //Gets the fields to be used and its type
    //The sequence in which it is printed is done with help of seq_id
    req.getConnection(function (error, conn) {
        conn.query("SELECT * FROM fiel ORDER BY seq_id ", function (err, rows, fields) {
            if (err) {
                console.log(err)
                res.json({
                    data: ('Error Occurred')
                })
            } else {//This is done to parse 
                var labe = []
                var val;
                for (var i = 0; i < rows.length; i++) {
                    var obj = {
                        id: "",
                        label: "",
                        type: "",
                        option: ""
                    };
                    console.log(rows[i].name, rows[i].type, rows[i].desp)
                    obj.id = rows[i].id
                    obj.label = rows[i].name
                    obj.type = rows[i].type
                    console.log(rows[i].desp)
                    if (obj.option !== null) {
                        var arr = String(rows[i].desp)
                        obj.option = arr.split("_")
                    } else {
                        obj.option = []
                    }
                    labe.push(obj)
                }
            }
            res.json(labe)

        })
    })
})

app.listen(8081, () => {
    console.log("server Running successfully")
})