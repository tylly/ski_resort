





    
    fetch(`https://api.infermedica.com/v3/diagnosis`, options)
        .then(response => console.log(response))
        // .then(response => {
        //     console.log(response)
        //     })
        .catch(err => {console.error(err)
        });
