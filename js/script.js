// ====================================
// SCRIPT.JS - Tous les effets des cartes
// ====================================

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    
    const cards = document.querySelectorAll('.card');
    
    // ====================================
    // 1. EFFET PARALLAXE 3D AU MOUVEMENT DE LA SOURIS
    // ====================================
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
    });
    
    
    // ====================================
    // 2. COMPTEUR DE VUES
    // ====================================
    const viewCounts = {};
    
    cards.forEach((card, index) => {
        viewCounts[index] = 0;
        
        // Créer le badge de compteur
        const badge = document.createElement('span');
        badge.className = 'position-absolute top-0 end-0 badge bg-danger m-2';
        badge.style.zIndex = '5';
        badge.textContent = '0 vue';
        card.style.position = 'relative';
        card.appendChild(badge);
        
        // Incrémenter au survol
        card.addEventListener('mouseenter', () => {
            viewCounts[index]++;
            badge.textContent = viewCounts[index] + ' vue' + (viewCounts[index] > 1 ? 's' : '');
            
            // Animation du badge
            badge.style.animation = 'pulse 0.3s ease';
            setTimeout(() => {
                badge.style.animation = '';
            }, 300);
        });
    });
    
    
    // ====================================
    // 3. EFFET DE PARTICULES AU SURVOL
    // ====================================
    cards.forEach(card => {
        let particleInterval;
        
        card.addEventListener('mouseenter', () => {
            // Créer des particules en continu pendant le survol
            particleInterval = setInterval(() => {
                createParticle(card);
            }, 100);
        });
        
        card.addEventListener('mouseleave', () => {
            clearInterval(particleInterval);
        });
    });
    
    function createParticle(card) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 8 + 3 + 'px';
        particle.style.height = particle.style.width;
        particle.style.borderRadius = '50%';
        particle.style.backgroundColor = getRandomColor();
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1';
        particle.style.opacity = '0.8';
        
        const rect = card.getBoundingClientRect();
        const startX = Math.random() * rect.width;
        const startY = Math.random() * rect.height;
        
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        
        card.appendChild(particle);
        
        // Animation de la particule
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 50 + 30;
        const lifetime = Math.random() * 1000 + 500;
        
        let opacity = 0.8;
        const startTime = Date.now();
        
        const animateParticle = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / lifetime;
            
            if (progress >= 1) {
                particle.remove();
                return;
            }
            
            const newX = startX + Math.cos(angle) * velocity * progress;
            const newY = startY + Math.sin(angle) * velocity * progress;
            
            particle.style.left = newX + 'px';
            particle.style.top = newY + 'px';
            particle.style.opacity = (1 - progress) * 0.8;
            
            requestAnimationFrame(animateParticle);
        };
        
        requestAnimationFrame(animateParticle);
    }
    
    function getRandomColor() {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    
    // ====================================
    // 4. MODAL D'APERÇU AU CLIC
    // ====================================
    cards.forEach((card, index) => {
        card.style.cursor = 'pointer';
        
        card.addEventListener('click', (e) => {
            // Ne pas ouvrir la modal si on clique sur le lien "Lire Plus"
            if (e.target.classList.contains('card-link')) {
                return;
            }
            
            const imgSrc = card.querySelector('img').src;
            const text = card.querySelector('.card-text').textContent;
            
            // Créer la modal
            const modalId = 'cardModal' + index;
            let modalElement = document.getElementById(modalId);
            
            if (!modalElement) {
                const modalHTML = `
                    <div class="modal fade" id="${modalId}" tabindex="-1">
                        <div class="modal-dialog modal-lg modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">Détails de la série</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                </div>
                                <div class="modal-body">
                                    <img src="${imgSrc}" class="img-fluid rounded mb-3" alt="Image série">
                                    <p class="lead">${text}</p>
                                    <div class="d-flex gap-2">
                                        <span class="badge bg-primary">Série TV</span>
                                        <span class="badge bg-success">Populaire</span>
                                        <span class="badge bg-info">HD</span>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                                    <button type="button" class="btn btn-primary">Regarder maintenant</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                document.body.insertAdjacentHTML('beforeend', modalHTML);
                modalElement = document.getElementById(modalId);
            }
            
            const bsModal = new bootstrap.Modal(modalElement);
            bsModal.show();
        });
    });
    
    
    // ====================================
    // 5. EFFET DE BORDURE ANIMÉE
    // ====================================
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.borderColor = getRandomColor();
            card.style.borderWidth = '3px';
            card.style.borderStyle = 'solid';
            card.style.transition = 'border-color 0.3s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.border = '1px solid rgba(0,0,0,.125)';
        });
    });
    
    
    // ====================================
    // 6. AJOUT D'UNE ANIMATION CSS AU CHARGEMENT
    // ====================================
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .card {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        .card:nth-child(1) { animation-delay: 0.1s; }
        .card:nth-child(2) { animation-delay: 0.2s; }
        .card:nth-child(3) { animation-delay: 0.3s; }
        .card:nth-child(4) { animation-delay: 0.4s; }
        .card:nth-child(5) { animation-delay: 0.5s; }
        .card:nth-child(6) { animation-delay: 0.6s; }
        .card:nth-child(7) { animation-delay: 0.7s; }
        .card:nth-child(8) { animation-delay: 0.8s; }
        .card:nth-child(9) { animation-delay: 0.9s; }
    `;
    document.head.appendChild(style);
    
    
    // ====================================
    // CONSOLE LOG POUR CONFIRMER LE CHARGEMENT
    // ====================================
    console.log('✅ Script des cartes chargé avec succès!');
    console.log('📊 Nombre de cartes détectées:', cards.length);
    console.log('🎨 Effets activés: Parallaxe 3D, Compteur de vues, Particules, Modal, Bordures animées');
});