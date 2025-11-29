class LambdaHeader extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `\
            <style>
                .header {
                    background: linear-gradient(135deg, #991b1b 0%, #dc2626 50%, #ef4444 100%);
                    padding: 1rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    position: sticky;
                    top: 0;
                    z-index: 40;
                }
                
                .header-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .logo {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: bold;
                    font-size: 1.25rem;
                }
                
                .stats {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }
                
                .stat-item {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    font-size: 0.875rem;
                    opacity: 0.9;
                }
                
                @media (max-width: 640px) {
                    .stats {
                        display: none;
                    }
                    
                    .logo {
                        font-size: 1.125rem;
                    }
                }
                
                @media (max-width: 480px) {
                    .header {
                        padding: 0.75rem 1rem;
                    }
                }
            </style>
            <header class="header">
                <div class="header-content">
                    <div class="logo">
                        <i data-feather="zap"></i>
                        LambdaMiner
                    </div>
                    <div class="stats">
                        <div class="stat-item">
                            <i data-feather="clock"></i>
                            <span>2h CD</span>
                        </div>
                        <div class="stat-item">
                            <i data-feather="trending-up"></i>
                            <span>0.036λ/h</span>
                        </div>
                    </div>
                </div>
            </header>
        `;
    }
}

customElements.define('lambda-header', LambdaHeader);