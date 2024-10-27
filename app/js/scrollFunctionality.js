const scrollContainers = document.querySelectorAll('.scroll-container');

scrollContainers.forEach(container => {
    setScroll(container);
});

function setScroll(container) {
    const content = container.querySelector('.scrollable-content');
    const thumb = container.querySelector('.custom-thumb');

    thumb.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDragging);

    window.addEventListener('resize', updateThumbHeight);
    content.addEventListener('scroll', updateThumbPosition);

    function updateThumbHeight() {
        const contentHeight = content.scrollHeight;
        const containerHeight = container.clientHeight;
        const thumbHeight = Math.max((containerHeight / contentHeight) * containerHeight, 40); // Минимум 40px
        thumb.style.height = `${thumbHeight}px`;
    
        if (thumbHeight >= containerHeight) {
            thumb.style.height = `0px`;
        }
    }
    
    function updateThumbPosition() {
        const contentScrollTop = content.scrollTop;
        const contentHeight = content.scrollHeight;
        const containerHeight = container.clientHeight;
        const scrollRatio = contentScrollTop / (contentHeight - containerHeight);
        const thumbTop = scrollRatio * (containerHeight - thumb.clientHeight - 10);
        thumb.style.top = `${thumbTop + 5}px`;
    }

    let isDragging = false;
    let startY;
    let startScrollTop;

    function startDragging(event) {
        isDragging = true;
        startY = event.clientY;
        startScrollTop = content.scrollTop;
    }

    function stopDragging() {
        isDragging = false;
    }

    function onDrag(event) {
        if (!isDragging) return;
        const deltaY = event.clientY - startY;
        const contentHeight = content.scrollHeight;
        const containerHeight = container.clientHeight;
        const scrollRatio = (contentHeight - containerHeight) / (containerHeight - thumb.clientHeight);
        content.scrollTop = startScrollTop + deltaY * scrollRatio;
    }
}