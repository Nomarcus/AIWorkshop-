(function () {
  const copyButtons = document.querySelectorAll('[data-copy-target]');

  copyButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-copy-target');
      const target = document.getElementById(targetId);
      if (!target) {
        return;
      }

      const originalText = button.textContent;
      const text = Array.from(target.querySelectorAll('li'))
        .map((li, index) => `${index + 1}. ${li.textContent.trim()}`)
        .join('\n');

      const handleSuccess = () => {
        button.textContent = 'Spelregler kopierade!';
        button.disabled = true;
        button.classList.add('success');
        setTimeout(() => {
          button.textContent = originalText;
          button.disabled = false;
          button.classList.remove('success');
        }, 2500);
      };

      const handleError = () => {
        button.textContent = 'Kunde inte kopiera';
        button.classList.add('error');
        setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove('error');
        }, 2500);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(handleSuccess).catch(handleError);
      } else {
        try {
          const textarea = document.createElement('textarea');
          textarea.value = text;
          textarea.setAttribute('readonly', '');
          textarea.style.position = 'absolute';
          textarea.style.left = '-9999px';
          document.body.appendChild(textarea);
          textarea.select();
          const succeeded = document.execCommand('copy');
          document.body.removeChild(textarea);
          if (succeeded) {
            handleSuccess();
          } else {
            handleError();
          }
        } catch (error) {
          handleError();
        }
      }
    });
  });

  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach((item) => {
    const trigger = item.querySelector('.accordion-trigger');
    const panel = item.querySelector('.accordion-panel');

    if (!trigger || !panel) {
      return;
    }

    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';

      accordionItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.setAttribute('aria-expanded', 'false');
          const otherTrigger = otherItem.querySelector('.accordion-trigger');
          const otherPanel = otherItem.querySelector('.accordion-panel');
          if (otherTrigger && otherPanel) {
            otherTrigger.setAttribute('aria-expanded', 'false');
            otherPanel.style.maxHeight = null;
            otherPanel.setAttribute('aria-hidden', 'true');
            otherPanel.classList.remove('show');
          }
        }
      });

      if (expanded) {
        item.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = null;
        panel.setAttribute('aria-hidden', 'true');
        panel.classList.remove('show');
      } else {
        item.setAttribute('aria-expanded', 'true');
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        panel.setAttribute('aria-hidden', 'false');
        panel.classList.add('show');
      }
    });
  });
})();
