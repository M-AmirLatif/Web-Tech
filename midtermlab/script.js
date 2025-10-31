const sectionHeadings = document.querySelectorAll('.section-heading');

  sectionHeadings.forEach(heading => {
    heading.addEventListener('mouseenter', function() {
      const details = this.nextElementSibling;
      details.style.display = 'block';
      details.style.opacity = '1';
    });

    heading.addEventListener('mouseleave', function() {
      const details = this.nextElementSibling;
      details.style.display = 'none';
      details.style.opacity = '0';
    });
  });