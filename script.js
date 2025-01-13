// Add subtle fade-in effect for story links
document.addEventListener('DOMContentLoaded', () => {
    const storyLinks = document.querySelectorAll('.story-link');
    
    storyLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            link.style.transition = 'all 0.5s ease';
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, 100 * index);
    });
    fetchVideoStats();
}); 

// YouTube API integration
const API_KEY = 'AIzaSyCQyD_NGfqerJXMC10d9oTqdCk_MmS5nn0'; // You'll need to get this from Google Cloud Console

async function fetchVideoStats() {
    const narrationLinks = document.querySelectorAll('.narration-link[data-video-id]');
    
    // Collect all video IDs
    const videoIds = Array.from(narrationLinks).map(link => link.dataset.videoId).join(',');
    
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${API_KEY}`
        );
        
        const data = await response.json();
        
        // Update view counts for each video
        data.items.forEach(item => {
            const link = document.querySelector(`.narration-link[data-video-id="${item.id}"]`);
            const viewsElement = link.querySelector('.views');
            const viewCount = parseInt(item.statistics.viewCount);
            
            // Format view count
            viewsElement.textContent = formatViewCount(viewCount);
        });
    } catch (error) {
        console.error('Error fetching YouTube stats:', error);
        // Fallback for error cases
        document.querySelectorAll('.views').forEach(element => {
            element.textContent = 'Views unavailable';
        });
    }
}

// Format view count (e.g., 1.2M, 45K, etc.)
function formatViewCount(views) {
    if (views >= 1000000) {
        return (views / 1000000).toFixed(1) + 'M views';
    } else if (views >= 1000) {
        return (views / 1000).toFixed(1) + 'K views';
    }
    return views + ' views';
} 