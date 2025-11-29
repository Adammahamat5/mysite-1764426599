class LambdaNavigation extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `\
            <style>
                .nav-container {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: linear-gradient(135deg, #991b1b 0%, #dc2626 100%);
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 0.5rem;
                    z-index: 50;
                }
                
                .nav-grid {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 0.25rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                
                .nav-button {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 0.5rem 0.25rem;
                    border-radius: 0.75rem;
                    transition: all 0.3s ease;
                    background: transparent;
                    border: none;
                    color: rgba(255, 255, 255, 0.7);
                    cursor: pointer;
                    font-size: 0.75rem;
                }
                
                .nav-button.active {
                    background: rgba(255, 255, 255, 0.15);
                    color: white;
                    transform: translateY(-2px);
                }
                
                .nav-button:hover:not(.active) {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }
                
                .nav-icon {
                    width: 1.25rem;
                    height: 1.25rem;
                    margin-bottom: 0.25rem;
                }
                
                .nav-button.mine.active {
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                    color: #991b1b;
                }
                
                .nav-button.mine:hover:not(.active) {
                    background: rgba(245, 158, 11, 0.2);
                }
                
                @media (max-width: 480px) {
                    .nav-grid {
                        gap: 0.125rem;
                    }
                    
                    .nav-button {
                        padding: 0.375rem 0.125rem;
                        font-size: 0.7rem;
                    }
                    
                    .nav-icon {
                        width: 1.125rem;
                        height: 1.125rem;
                    }
                }
                
                @media (max-width: 360px) {
                    .nav-button {
                        font-size: 0.65rem;
                    }
                    
                    .nav-icon {
                        width: 1rem;
                        height: 1rem;
                    }
                }
            </style>
            <div class="nav-container">
                <div class="nav-grid">
                    <button class="nav-button mine active" data-section="mine">
                        <i data-feather="zap" class="nav-icon"></i>
                        Mine
                    </button>
                    <button class="nav-button" data-section="wallet">
                        <i data-feather="credit-card" class="nav-icon"></i>
                        Wallet
                    </button>
                    <button class="nav-button" data-section="tasks">
                        <i data-feather="check-circle" class="nav-icon"></i>
                        Tasks
                    </button>
                    <button class="nav-button" data-section="airdrop">
                        <i data-feather="gift" class="nav-icon"></i>
                        Airdrop
                    </button>
                    <button class="nav-button" data-section="settings">
                        <i data-feather="settings" class="nav-icon"></i>
                        Settings
                    </button>
                </div>
            </div>
`;
    }
}

customElements.define('lambda-navigation', LambdaNavigation);