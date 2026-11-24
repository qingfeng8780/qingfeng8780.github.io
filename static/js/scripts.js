'use strict';
window.addEventListener('DOMContentLoaded', async () => {
  const toggler = document.querySelector('.navbar-toggler');
  document.querySelectorAll('#navbarResponsive .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (getComputedStyle(toggler).display !== 'none' && toggler.getAttribute('aria-expanded') === 'true') {
        bootstrap.Collapse.getOrCreateInstance(document.querySelector('#navbarResponsive')).hide();
      }
    });
  });
  marked.use({mangle: false, headerIds: false});
  const sections = ['home', 'publications', 'awards'];
  await Promise.all(sections.map(async name => {
    const target = document.getElementById(name + '-md');
    try {
      const response = await fetch('contents/' + name + '.md');
      if (!response.ok) throw new Error('HTTP ' + response.status);
      target.innerHTML = marked.parse(await response.text());
    } catch(error) {
      target.innerHTML = '<p>Content could not be loaded. Please refresh, or <a href="assets/Xiangye_Zhu_CV.pdf">read my CV</a>.</p>';
      console.error(name + ': ' + error.message);
    }
  }));
  bootstrap.ScrollSpy.getOrCreateInstance(document.body, {target: '#mainNav', offset: 90}).refresh();
  document.documentElement.dataset.contentLoaded = 'true';
});
