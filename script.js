'use strict';

const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!expanded));
  navigation.classList.toggle('open', !expanded);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) {
    navigation.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.focus();
  }
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
}));

const filters = [...document.querySelectorAll('.filter')];
const publications = [...document.querySelectorAll('.publication')];
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(filter => {
    const selected = filter === button;
    filter.classList.toggle('active', selected);
    filter.setAttribute('aria-pressed', String(selected));
  });
  let count = 0;
  publications.forEach(publication => {
    publication.hidden = button.dataset.filter !== 'all' && publication.dataset.type !== button.dataset.filter;
    if (!publication.hidden) count++;
  });
  document.querySelector('#publication-count').textContent = `${count} ${count === 1 ? 'paper' : 'papers'}`;
}));

document.querySelectorAll('.citation-toggle').forEach(button => button.addEventListener('click', () => {
  const panel = document.getElementById(button.getAttribute('aria-controls'));
  const expanded = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!expanded));
  panel.hidden = expanded;
  button.textContent = expanded ? 'Cite' : 'Hide citation';
}));

async function copyText(text, feedback) {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(text);
    feedback.textContent = 'Copied';
  } catch {
    // The fallback also works when the site is opened directly from disk.
    const field = document.createElement('textarea');
    field.value = text;
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.append(field);
    field.select();
    let copied = false;
    try { copied = document.execCommand('copy'); } catch {}
    field.remove();
    feedback.textContent = copied ? 'Copied' : 'Please select and copy the text.';
  }
  clearTimeout(feedback.clearTimer);
  feedback.clearTimer = setTimeout(() => { feedback.textContent = ''; }, 3000);
}
document.querySelectorAll('.copy-citation').forEach(button => button.addEventListener('click', () => {
  const panel = button.closest('.citation');
  copyText(panel.querySelector('pre').textContent, panel.querySelector('.copy-feedback'));
}));
document.querySelector('#copy-email').addEventListener('click', () => copyText('1418948780@qq.com', document.querySelector('#email-feedback')));

if ('IntersectionObserver' in window) {
  const links = [...navigation.querySelectorAll('a')];
  const sections = [...document.querySelectorAll('main > section')];
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    if (!visible.length) return;
    links.forEach(link => {
      const active = link.hash === `#${visible[0].target.id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, {rootMargin: '-8% 0px -62% 0px', threshold: 0});
  sections.forEach(section => observer.observe(section));
}
