const projectsData = {
    1: {
        title: "Личный сайт-портфолио",
        description: "Создание современного адаптивного сайта-портфолио. Проект включает в себя интерактивные элементы и полную адаптацию под мобильные устройства. Особенности: семантическая верстка, оптимизация производительности, кроссбраузерная совместимость.",
        tech: "HTML5, CSS3, JavaScript, Flexbox, Grid",
        image: "../images/project1.jpg", 
        imageStyle: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        liveLink: "https://leha3221.github.io/frontback/",
        codeLink: "https://github.com/leha3221/frontback"
    },
    2: {
        title: "Калькулятор",
        description: "Создание программы калькулятора на языке C#",
        tech: "C#",
        image: "../images/project2.jpg", 
        imageStyle: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        codeLink: "https://github.com/leha3221/calculator"
    },
    3: {
        title: "Сайт для семестровой работы",
        description: "Полнофункциональный сайт включающий в себя мобильную адаптацию, страницу товаров небольшую новостную ленту и страницу с контактами",
        tech: "HTML5, CSS3, JavaScript",
        image: "../images/project3.jpg", 
        imageStyle: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        liveLink: "https://leha3221.github.io/front-and-backend-prac/",
        codeLink: "https://github.com/leha3221/front-and-backend-prac"
    },
};

document.addEventListener('DOMContentLoaded', function() {

    initializeProjectImages();
    
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            filterProjects(filter);
        });
    });
    
    document.querySelectorAll('.project-details-btn').forEach(button => {
        button.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            openProjectModal(projectId);
        });
    });
    
    document.querySelector('.close').addEventListener('click', closeModal);
    
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('projectModal');
        if (event.target === modal) {
            closeModal();
        }
    });
});
function initializeProjectImages() {
    document.querySelectorAll('.project-card').forEach(card => {
        const projectId = card.querySelector('.project-details-btn').getAttribute('data-project');
        const project = projectsData[projectId];
        
        if (project && project.image) {
            const projectImage = card.querySelector('.project-image');
            const picture = document.createElement('picture');
            const sourceAvif = document.createElement('source');
            sourceAvif.type = 'image/avif';
            sourceAvif.srcset = `
                ${project.image.replace('.jpg', '-150.avif')} 150w,
                ${project.image.replace('.jpg', '-200.avif')} 200w,
                ${project.image.replace('.jpg', '-300.avif')} 300w
            `;
            sourceAvif.sizes = '(max-width: 768px) 150px, 200px';
            const sourceWebP = document.createElement('source');
            sourceWebP.type = 'image/webp';
            sourceWebP.srcset = `
                ${project.image.replace('.jpg', '-150.webp')} 150w,
                ${project.image.replace('.jpg', '-200.webp')} 200w,
                ${project.image.replace('.jpg', '-300.webp')} 300w
            `;
            sourceWebP.sizes = '(max-width: 768px) 150px, 200px';
            const img = document.createElement('img');
            img.src = project.image;
            img.srcset = `
                ${project.image.replace('.jpg', '-150.jpg')} 150w,
                ${project.image.replace('.jpg', '-200.jpg')} 200w,
                ${project.image.replace('.jpg', '-300.jpg')} 300w
            `;
            img.sizes = '(max-width: 768px) 150px, 200px';
            img.alt = project.title;
            img.width = 200;
            img.height = 180;
            img.className = 'project-responsive-image';
            img.loading = 'lazy';
            
            picture.appendChild(sourceAvif);
            picture.appendChild(sourceWebP);
            picture.appendChild(img);
            
            projectImage.innerHTML = '';
            projectImage.appendChild(picture);
            
            img.onerror = function() {
                picture.style.display = 'none';
                projectImage.style.background = project.imageStyle;
                projectImage.style.display = 'flex';
                projectImage.style.alignItems = 'center';
                projectImage.style.justifyContent = 'center';
                projectImage.style.color = 'white';
                projectImage.style.fontWeight = 'bold';
                projectImage.innerHTML = project.title;
            };
        }
    });
}
function openProjectModal(projectId) {
    const project = projectsData[projectId];
    
    if (project) {
        document.getElementById('modalTitle').textContent = project.title;
        document.getElementById('modalDescription').textContent = project.description;
        document.getElementById('modalTech').textContent = project.tech;
        const modalImage = document.getElementById('modalImage');
        if (project.image) {
            modalImage.innerHTML = `<img src="${project.image}" alt="${project.title}" style="width:100%; height:100%; object-fit:cover; border-radius:10px;">`;

            const img = modalImage.querySelector('img');
            img.onerror = function() {
                modalImage.innerHTML = '';
                modalImage.style.background = project.imageStyle;
                modalImage.style.display = 'flex';
                modalImage.style.alignItems = 'center';
                modalImage.style.justifyContent = 'center';
                modalImage.style.color = 'white';
                modalImage.style.fontWeight = 'bold';
                modalImage.innerHTML = project.title;
            };
        } else {
            modalImage.innerHTML = '';
            modalImage.style.background = project.imageStyle;
            modalImage.style.display = 'flex';
            modalImage.style.alignItems = 'center';
            modalImage.style.justifyContent = 'center';
            modalImage.style.color = 'white';
            modalImage.style.fontWeight = 'bold';
            modalImage.innerHTML = project.title;
        }
        const liveLink = document.getElementById('modalLiveLink');
        const codeLink = document.getElementById('modalCodeLink');
        
        if (project.liveLink) {
            liveLink.href = project.liveLink;
            liveLink.style.display = 'inline-block';
        } else {
            liveLink.style.display = 'none';
        }
        
        codeLink.href = project.codeLink;
        
        document.getElementById('projectModal').style.display = 'block';
        document.body.style.overflow = 'hidden'; 
    }
}

function closeModal() {
    document.getElementById('projectModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}