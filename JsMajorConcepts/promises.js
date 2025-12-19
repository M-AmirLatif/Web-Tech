const works = ["first", "second", "third"];

const promise = createfirst(works);

promise.then((workid) => {return validateworks(workid)})
.then((jobid) => { return jobstatus(jobid)})
.then(() => {console.log("all works are done")})
.catch((error) => {console.log(error)})


function createfirst(works){
    return new Promise((resolve, reject) => {

        if(!validateworks(works)){
            reject("works is not valid");
        }
        const workid = "123"
        setTimeout(() => {
            resolve(workid);
        }, 2000);
    })

}

function jobstatus(jobid){
    return console.log("job is done for jobid:", jobid);
}

function validateworks(workid){
    return workid;
}