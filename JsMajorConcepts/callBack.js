window.onload = function() {
    let mybtn1 = document.getElementById("mybtn"); // Removed the '#' prefix

    function handleeventlistener() {
        let count = 1;
        mybtn1.addEventListener("click", function x() {
            console.log("btn clicked", count++);
        });
    }

    handleeventlistener();
    
};

