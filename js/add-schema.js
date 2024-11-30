fetch('structured-data.json')
    .then(response => response.json())
    .then(data => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(data);
        document.head.appendChild(script);
    })
    .catch(error => console.error('Ошибка загрузки структурированных данных:', error));