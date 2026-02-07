/**
 * NarrativeOS™ Main Application
 * Powered by StoryGTM
 * 
 * Core application logic for the Product Marketing Platform
 */

(function () {
    'use strict';

    // Application State
    const AppState = {
        currentPage: 'dashboard',
        stats: {
            productStories: 0,
            battleCards: 0,
            creativeHooks: 0,
            gtmPlans: 0
        },
        history: []
    };

    // DOM Elements Cache
    const DOM = {};

    /**
     * Initialize the application
     */
    function init() {
        cacheDOMElements();
        setupEventListeners();
        setupNavigation();
        loadSavedState();

        // Log initialization
        NarrativeOSSecurity.logAuditEvent('APP_INITIALIZED', {
            page: AppState.currentPage,
            timestamp: new Date().toISOString()
        });

        console.log('%c🚀 NarrativeOS™ Initialized', 'color: #6366f1; font-size: 14px; font-weight: bold;');
    }

    /**
     * Cache frequently accessed DOM elements
     */
    function cacheDOMElements() {
        DOM.sidebar = document.getElementById('sidebar');
        DOM.menuToggle = document.getElementById('menu-toggle');
        DOM.mainContent = document.getElementById('main-content');
        DOM.pageContainer = document.getElementById('page-container');
        DOM.pageTitle = document.getElementById('page-title');
        DOM.navItems = document.querySelectorAll('.nav-item');
        DOM.pages = document.querySelectorAll('.page');
    }

    /**
     * Set up event listeners
     */
    function setupEventListeners() {
        // Mobile menu toggle
        if (DOM.menuToggle) {
            DOM.menuToggle.addEventListener('click', toggleSidebar);
        }

        // Close sidebar on click outside (mobile)
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!DOM.sidebar.contains(e.target) &&
                    !DOM.menuToggle.contains(e.target) &&
                    DOM.sidebar.classList.contains('open')) {
                    DOM.sidebar.classList.remove('open');
                }
            }
        });

        // Form submissions
        setupFormHandlers();

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboard);
    }

    /**
     * Toggle sidebar for mobile
     */
    function toggleSidebar() {
        DOM.sidebar.classList.toggle('open');
    }

    /**
     * Set up navigation
     */
    function setupNavigation() {
        DOM.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                if (page) {
                    navigateTo(page);
                }
            });
        });

        // Handle hash navigation
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1);
            if (hash) {
                navigateTo(hash);
            }
        });

        // Check initial hash
        const initialHash = window.location.hash.slice(1);
        if (initialHash) {
            navigateTo(initialHash);
        }
    }

    /**
     * Navigate to a page
     * @param {string} pageName - The page identifier
     */
    function navigateTo(pageName) {
        // Rate limit check
        const rateCheck = NarrativeOSSecurity.checkRateLimit();
        if (!rateCheck.allowed) {
            showNotification('Please slow down. Try again in a few seconds.', 'warning');
            return;
        }

        // Update active nav item
        DOM.navItems.forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-page') === pageName);
        });

        // Update active page
        DOM.pages.forEach(page => {
            page.classList.toggle('active', page.id === `page-${pageName}`);
        });

        // Update page title
        const titles = {
            'dashboard': 'Dashboard',
            'product-understanding': 'Product Understanding',
            'positioning': 'Positioning Engine',
            'story-architecture': 'Story Architecture',
            'creative-hooks': 'Creative Hooks',
            'gtm-launch': 'Launch Planning',
            'battle-cards': 'Battle Cards',
            'win-loss': 'Win/Loss Analysis',
            'market-segments': 'Market Segments',
            'roadmap-story': 'Roadmap Stories'
        };

        if (DOM.pageTitle) {
            DOM.pageTitle.textContent = titles[pageName] || 'NarrativeOS';
        }

        // Update state and history
        AppState.currentPage = pageName;
        AppState.history.push({ page: pageName, time: Date.now() });

        // Update URL hash
        window.location.hash = pageName;

        // Close mobile sidebar
        if (window.innerWidth <= 768) {
            DOM.sidebar.classList.remove('open');
        }

        // Log navigation
        NarrativeOSSecurity.logAuditEvent('NAVIGATION', { page: pageName });
    }

    // Make navigateTo globally accessible
    window.navigateTo = navigateTo;

    /**
     * Set up form handlers
     */
    function setupFormHandlers() {
        // Product Understanding Form
        const productForm = document.getElementById('product-form');
        if (productForm) {
            productForm.addEventListener('submit', handleProductForm);
        }

        // Positioning Form
        const positioningForm = document.getElementById('positioning-form');
        if (positioningForm) {
            positioningForm.addEventListener('submit', handlePositioningForm);
        }

        // Story Architecture Form
        const storyForm = document.getElementById('story-form');
        if (storyForm) {
            storyForm.addEventListener('submit', handleStoryForm);
        }

        // Creative Hooks Form
        const hooksForm = document.getElementById('hooks-form');
        if (hooksForm) {
            hooksForm.addEventListener('submit', handleHooksForm);
        }

        // Battle Cards Form
        const battlecardForm = document.getElementById('battlecard-form');
        if (battlecardForm) {
            battlecardForm.addEventListener('submit', handleBattleCardForm);
        }

        // Win/Loss Form
        const winlossForm = document.getElementById('winloss-form');
        if (winlossForm) {
            winlossForm.addEventListener('submit', handleWinLossForm);
        }

        // GTM Launch Form
        const gtmForm = document.getElementById('gtm-form');
        if (gtmForm) {
            gtmForm.addEventListener('submit', handleGTMForm);
        }

        // Market Segments Form
        const segmentForm = document.getElementById('segment-form');
        if (segmentForm) {
            segmentForm.addEventListener('submit', handleSegmentForm);
        }

        // Roadmap Form
        const roadmapForm = document.getElementById('roadmap-form');
        if (roadmapForm) {
            roadmapForm.addEventListener('submit', handleRoadmapForm);
        }
    }

    /**
     * Handle Product Understanding Form
     */
    function handleProductForm(e) {
        e.preventDefault();

        const formData = {
            productName: document.getElementById('product-name').value,
            productCategory: document.getElementById('product-category').value,
            productDescription: document.getElementById('product-description').value,
            targetAudience: document.getElementById('target-audience').value,
            keyFeatures: document.getElementById('key-features').value
        };

        // Validate
        const validation = NarrativeOSSecurity.validateFormData(formData, {
            productName: { required: true, label: 'Product Name', maxLength: 100 },
            productDescription: { required: true, label: 'Description', maxLength: 5000 }
        });

        if (!validation.valid) {
            showFormErrors(validation.errors);
            return;
        }

        showLoading('product-output');

        // Simulate AI processing
        setTimeout(() => {
            const output = generateProductAnalysis(validation.sanitized);
            displayOutput('product-output', output);
            incrementStat('productStories');
        }, 1500);
    }

    /**
     * Handle Positioning Form
     */
    function handlePositioningForm(e) {
        e.preventDefault();

        const formData = {
            product: document.getElementById('pos-product').value,
            category: document.getElementById('pos-category').value,
            unique: document.getElementById('pos-unique').value,
            competitors: document.getElementById('pos-competitors').value,
            persona: document.getElementById('pos-persona').value
        };

        const validation = NarrativeOSSecurity.validateFormData(formData, {
            product: { required: true, label: 'Product Name', maxLength: 100 },
            category: { required: true, label: 'Market Category', maxLength: 200 }
        });

        if (!validation.valid) {
            showFormErrors(validation.errors);
            return;
        }

        showLoading('positioning-output');

        setTimeout(() => {
            const output = generatePositioning(validation.sanitized);
            displayOutput('positioning-output', output);
        }, 1500);
    }

    /**
     * Handle Story Architecture Form
     */
    function handleStoryForm(e) {
        e.preventDefault();

        const formData = {
            product: document.getElementById('story-product').value,
            type: document.getElementById('story-type').value,
            problem: document.getElementById('story-problem').value,
            solution: document.getElementById('story-solution').value,
            outcome: document.getElementById('story-outcome').value
        };

        const validation = NarrativeOSSecurity.validateFormData(formData, {
            product: { required: true, label: 'Product Name', maxLength: 100 },
            problem: { required: true, label: 'Problem Statement', maxLength: 2000 }
        });

        if (!validation.valid) {
            showFormErrors(validation.errors);
            return;
        }

        showLoading('story-output');

        setTimeout(() => {
            const output = generateStoryArchitecture(validation.sanitized);
            displayOutput('story-output', output);
            incrementStat('productStories');
        }, 1500);
    }

    /**
     * Handle Creative Hooks Form
     */
    function handleHooksForm(e) {
        e.preventDefault();

        const formData = {
            product: document.getElementById('hooks-product').value,
            audience: document.getElementById('hooks-audience').value,
            context: document.getElementById('hooks-context').value,
            pain: document.getElementById('hooks-pain').value
        };

        const validation = NarrativeOSSecurity.validateFormData(formData, {
            product: { required: true, label: 'Product/Topic', maxLength: 200 },
            pain: { required: true, label: 'Pain Point', maxLength: 1000 }
        });

        if (!validation.valid) {
            showFormErrors(validation.errors);
            return;
        }

        showLoading('hooks-output');

        setTimeout(() => {
            const output = generateCreativeHooks(validation.sanitized);
            displayOutput('hooks-output', output);
            incrementStat('creativeHooks');
        }, 1800);
    }

    /**
     * Handle Battle Card Form
     */
    function handleBattleCardForm(e) {
        e.preventDefault();

        const formData = {
            product: document.getElementById('bc-product').value,
            competitor: document.getElementById('bc-competitor').value,
            category: document.getElementById('bc-category').value,
            strengths: document.getElementById('bc-strengths').value,
            weaknesses: document.getElementById('bc-weaknesses').value,
            objections: document.getElementById('bc-objections').value
        };

        const validation = NarrativeOSSecurity.validateFormData(formData, {
            product: { required: true, label: 'Your Product', maxLength: 100 },
            competitor: { required: true, label: 'Competitor Name', maxLength: 100 }
        });

        if (!validation.valid) {
            showFormErrors(validation.errors);
            return;
        }

        showLoading('battlecard-output');

        setTimeout(() => {
            const output = generateBattleCard(validation.sanitized);
            displayOutput('battlecard-output', output);
            incrementStat('battleCards');
        }, 2000);
    }

    /**
     * Handle Win/Loss Form
     */
    function handleWinLossForm(e) {
        e.preventDefault();

        const formData = {
            deal: document.getElementById('wl-deal').value,
            outcome: document.getElementById('wl-outcome').value,
            competitor: document.getElementById('wl-competitor').value,
            reason: document.getElementById('wl-reason').value,
            notes: document.getElementById('wl-notes').value
        };

        const validation = NarrativeOSSecurity.validateFormData(formData, {
            deal: { required: true, label: 'Deal Name', maxLength: 200 },
            outcome: { required: true, label: 'Outcome' }
        });

        if (!validation.valid) {
            showFormErrors(validation.errors);
            return;
        }

        showLoading('winloss-output');

        setTimeout(() => {
            const output = generateWinLossAnalysis(validation.sanitized);
            displayOutput('winloss-output', output);
        }, 1500);
    }

    /**
     * Handle GTM Launch Form
     */
    function handleGTMForm(e) {
        e.preventDefault();

        const formData = {
            product: document.getElementById('gtm-product').value,
            type: document.getElementById('gtm-type').value,
            phase: document.getElementById('gtm-phase').value,
            timeline: document.getElementById('gtm-timeline').value,
            goals: document.getElementById('gtm-goals').value
        };

        const validation = NarrativeOSSecurity.validateFormData(formData, {
            product: { required: true, label: 'Product Name', maxLength: 200 }
        });

        if (!validation.valid) {
            showFormErrors(validation.errors);
            return;
        }

        showLoading('gtm-output');

        setTimeout(() => {
            const output = generateGTMPlan(validation.sanitized);
            displayOutput('gtm-output', output);
            incrementStat('gtmPlans');
        }, 2000);
    }

    /**
     * Handle Segment Form
     */
    function handleSegmentForm(e) {
        e.preventDefault();

        const formData = {
            product: document.getElementById('seg-product').value,
            industry: document.getElementById('seg-industry').value,
            size: document.getElementById('seg-size').value,
            role: document.getElementById('seg-role').value,
            problem: document.getElementById('seg-problem').value
        };

        const validation = NarrativeOSSecurity.validateFormData(formData, {
            product: { required: true, label: 'Product', maxLength: 100 }
        });

        if (!validation.valid) {
            showFormErrors(validation.errors);
            return;
        }

        showLoading('segment-output');

        setTimeout(() => {
            const output = generateSegmentProfile(validation.sanitized);
            displayOutput('segment-output', output);
        }, 1500);
    }

    /**
     * Handle Roadmap Form
     */
    function handleRoadmapForm(e) {
        e.preventDefault();

        const formData = {
            feature: document.getElementById('rm-feature').value,
            timeline: document.getElementById('rm-timeline').value,
            technical: document.getElementById('rm-technical').value,
            audience: document.getElementById('rm-audience').value
        };

        const validation = NarrativeOSSecurity.validateFormData(formData, {
            feature: { required: true, label: 'Feature Name', maxLength: 200 },
            technical: { required: true, label: 'Technical Details', maxLength: 5000 }
        });

        if (!validation.valid) {
            showFormErrors(validation.errors);
            return;
        }

        showLoading('roadmap-output');

        setTimeout(() => {
            const output = generateRoadmapStory(validation.sanitized);
            displayOutput('roadmap-output', output);
        }, 1500);
    }

    // ============================================
    // Content Generation Functions
    // ============================================

    function generateProductAnalysis(data) {
        const features = data.keyFeatures.split('\n').filter(f => f.trim());

        return `
            <div class="output-content">
                <div class="output-section">
                    <h4>📊 Product Value Map</h4>
                    <p><strong>${data.productName}</strong> in ${data.productCategory || 'the market'} delivers value by addressing core customer needs through innovative solutions.</p>
                </div>
                
                <div class="output-section">
                    <h4>🎯 Jobs-to-be-Done Analysis</h4>
                    <ul class="output-list">
                        <li><span>Functional Job</span><span>Solve ${data.productCategory || 'core'} challenges efficiently</span></li>
                        <li><span>Emotional Job</span><span>Feel confident and in control</span></li>
                        <li><span>Social Job</span><span>Be seen as innovative by peers</span></li>
                    </ul>
                </div>
                
                <div class="output-section">
                    <h4>✨ Feature → Benefit → Outcome Matrix</h4>
                    <ul class="output-list">
                        ${features.slice(0, 5).map(f => `
                            <li>
                                <span><strong>${f}</strong></span>
                                <span>→ Enables faster, more reliable outcomes</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="output-section">
                    <h4>📖 Core Product Story</h4>
                    <p>${data.targetAudience || 'Teams'} struggle with complexity in ${data.productCategory || 'their workflow'}. <strong>${data.productName}</strong> transforms this by ${data.productDescription ? data.productDescription.substring(0, 150) + '...' : 'delivering a seamless experience'}. The result: faster decisions, better outcomes, and confident execution.</p>
                </div>
            </div>
        `;
    }

    function generatePositioning(data) {
        const competitors = data.competitors.split('\n').filter(c => c.trim());

        return `
            <div class="output-content">
                <div class="output-section">
                    <h4>🎯 Positioning Statement</h4>
                    <p>For <strong>${getPersonaName(data.persona)}</strong> who need ${data.category || 'a better solution'}, <strong>${data.product}</strong> is the ${data.category || 'platform'} that ${data.unique || 'delivers unique value'}. Unlike ${competitors[0] || 'alternatives'}, we ${data.unique || 'provide differentiated capabilities'}.</p>
                </div>
                
                <div class="output-section">
                    <h4>💎 Value Proposition</h4>
                    <p><strong>${data.product}</strong> enables ${getPersonaName(data.persona)} to achieve ${data.category || 'their goals'} with unprecedented clarity and speed.</p>
                </div>
                
                <div class="output-section">
                    <h4>⚔️ Competitive Differentiation</h4>
                    <ul class="output-list">
                        ${competitors.slice(0, 3).map(c => `
                            <li>
                                <span><strong>vs ${c}</strong></span>
                                <span>We win on: ${data.unique ? data.unique.substring(0, 50) : 'unique approach'}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="output-section">
                    <h4>🏛️ Differentiation Pillars</h4>
                    <ul class="output-list">
                        <li><span>Pillar 1</span><span>Narrative-first approach</span></li>
                        <li><span>Pillar 2</span><span>Enterprise-grade security</span></li>
                        <li><span>Pillar 3</span><span>Integrated GTM intelligence</span></li>
                    </ul>
                </div>
            </div>
        `;
    }

    function generateStoryArchitecture(data) {
        const storyTypes = {
            'origin': 'Origin Story',
            'transformation': 'Transformation Story',
            'vision': 'Vision Story',
            'customer': 'Customer Success Story'
        };

        return `
            <div class="output-content">
                <div class="output-section">
                    <h4>📖 ${storyTypes[data.type] || 'Product Story'}: ${data.product}</h4>
                </div>
                
                <div class="output-section">
                    <h4>Act 1: The Challenge</h4>
                    <p>${data.problem || 'Teams face significant challenges that slow them down and create friction...'}</p>
                </div>
                
                <div class="output-section">
                    <h4>Act 2: The Solution</h4>
                    <p><strong>${data.product}</strong> ${data.solution || 'transforms this reality by providing a fundamentally better approach...'}</p>
                </div>
                
                <div class="output-section">
                    <h4>Act 3: The Transformation</h4>
                    <p>${data.outcome || 'The result is a team that operates with clarity, speed, and confidence...'}</p>
                </div>
                
                <div class="output-section">
                    <h4>🎬 Story Framework</h4>
                    <ul class="output-list">
                        <li><span>Hook</span><span>"What if you could ${data.outcome ? data.outcome.substring(0, 40) : 'achieve more with less'}..."</span></li>
                        <li><span>Tension</span><span>The gap between current state and potential</span></li>
                        <li><span>Resolution</span><span>${data.product} as the bridge to success</span></li>
                    </ul>
                </div>
            </div>
        `;
    }

    function generateCreativeHooks(data) {
        const hooks = [
            {
                text: `"Why the old way of ${data.pain ? data.pain.substring(0, 30) : 'doing things'} worked — until it didn't."`,
                emotion: 'Urgency',
                logic: 'Market evolution',
                context: 'Pitch'
            },
            {
                text: `"The invisible cost of ${data.product ? 'ignoring ' + data.product : 'the status quo'} that nobody budgets for."`,
                emotion: 'Fear (FOMO)',
                logic: 'Hidden costs',
                context: 'Website'
            },
            {
                text: `"What ${data.audience || 'high-performers'} know about ${data.product || 'success'} that others don't."`,
                emotion: 'Aspiration',
                logic: 'Insider knowledge',
                context: 'Demo'
            },
            {
                text: `"${data.pain ? data.pain.substring(0, 40) : 'Your biggest challenge'} isn't the problem. Your approach is."`,
                emotion: 'Provocation',
                logic: 'Paradigm shift',
                context: 'Social'
            },
            {
                text: `"In 2026, ${data.audience || 'teams'} who ${data.pain ? 'still struggle with ' + data.pain.substring(0, 20) : 'ignore this'} will be left behind."`,
                emotion: 'Urgency',
                logic: 'Future-proofing',
                context: 'PR'
            }
        ];

        return `
            <div class="output-content">
                <div class="output-section">
                    <h4>⚡ Creative Hooks for ${data.product || 'Your Product'}</h4>
                    <p>Target: <strong>${data.audience || 'Your Audience'}</strong> | Context: <strong>${data.context || 'General'}</strong></p>
                </div>
                
                ${hooks.map((hook, i) => `
                    <div class="hook-card">
                        <div class="hook-text">${hook.text}</div>
                        <div class="hook-meta">
                            <span class="hook-tag">🎭 ${hook.emotion}</span>
                            <span class="hook-tag">🧠 ${hook.logic}</span>
                            <span class="hook-tag">📍 ${hook.context}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function generateBattleCard(data) {
        return `
            <div class="output-content">
                <div class="output-section">
                    <h4>⚔️ Battle Card: ${data.product} vs ${data.competitor}</h4>
                    <p>Category: <strong>${data.category || 'Market Category'}</strong></p>
                </div>
                
                <div class="output-section">
                    <h4>🎯 Competitor Overview</h4>
                    <p><strong>${data.competitor}</strong> is a player in ${data.category || 'this market'}. Their approach focuses on ${data.weaknesses ? 'areas where they have ' + data.weaknesses.substring(0, 50) : 'traditional solutions'}.</p>
                </div>
                
                <div class="output-section">
                    <h4>✅ Where We Win</h4>
                    <ul class="output-list">
                        ${(data.strengths || 'Superior approach\nBetter integration\nFaster time-to-value').split('\n').filter(s => s.trim()).slice(0, 4).map(s => `
                            <li><span>✓</span><span>${s}</span></li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="output-section">
                    <h4>⚠️ Where They Win (Be Honest)</h4>
                    <ul class="output-list">
                        <li><span>•</span><span>Established brand recognition</span></li>
                        <li><span>•</span><span>Larger existing customer base</span></li>
                    </ul>
                </div>
                
                <div class="output-section">
                    <h4>💬 Objection Handlers</h4>
                    <ul class="output-list">
                        ${(data.objections || 'Price concern\nFeature parity\nIntegration questions').split('\n').filter(o => o.trim()).slice(0, 3).map(o => `
                            <li><span>"${o}"</span><span>→ Reframe around value and outcomes</span></li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="output-section">
                    <h4>🎤 One-Liner Talk Track</h4>
                    <p>"Unlike ${data.competitor}, ${data.product} was built from the ground up for ${data.category || 'this use case'}, which means you get ${data.strengths ? data.strengths.split('\n')[0] : 'better results'} without the compromises."</p>
                </div>
            </div>
        `;
    }

    function generateWinLossAnalysis(data) {
        const isWin = data.outcome === 'won';

        return `
            <div class="output-content">
                <div class="output-section">
                    <h4>${isWin ? '🏆' : '📉'} ${isWin ? 'Win' : 'Loss'} Analysis: ${data.deal}</h4>
                    <p>Outcome: <strong style="color: ${isWin ? 'var(--color-success)' : 'var(--color-error)'};">${isWin ? 'WON' : 'LOST'}</strong> 
                    ${data.competitor ? `| vs <strong>${data.competitor}</strong>` : ''}</p>
                </div>
                
                <div class="output-section">
                    <h4>📊 Pattern Analysis</h4>
                    <p>Primary Factor: <strong>${getReasonLabel(data.reason)}</strong></p>
                    <p>${data.notes || 'Additional context would help refine this analysis.'}</p>
                </div>
                
                <div class="output-section">
                    <h4>${isWin ? '💡 Why We Won' : '🔍 Gap Identification'}</h4>
                    <ul class="output-list">
                        ${isWin ? `
                            <li><span>•</span><span>Strong value proposition alignment</span></li>
                            <li><span>•</span><span>Effective competitive positioning</span></li>
                            <li><span>•</span><span>Clear ROI demonstration</span></li>
                        ` : `
                            <li><span>•</span><span>${data.reason === 'price' ? 'Pricing perception gap' : 'Positioning clarity needed'}</span></li>
                            <li><span>•</span><span>${data.reason === 'features' ? 'Feature gap to address' : 'Value communication opportunity'}</span></li>
                        `}
                    </ul>
                </div>
                
                <div class="output-section">
                    <h4>📝 Recommendations</h4>
                    <ul class="output-list">
                        <li><span>Messaging</span><span>${isWin ? 'Document and replicate successful narratives' : 'Strengthen value differentiation'}</span></li>
                        <li><span>Sales Enablement</span><span>${isWin ? 'Create case study from this win' : 'Update battle cards and objection handling'}</span></li>
                        <li><span>Roadmap Input</span><span>${data.reason === 'features' ? 'Prioritize gap features' : 'Continue current direction'}</span></li>
                    </ul>
                </div>
            </div>
        `;
    }

    function generateGTMPlan(data) {
        const phases = {
            'alpha': { label: 'Alpha', weeks: '2-4 weeks', audience: 'Internal team' },
            'beta': { label: 'Beta', weeks: '4-8 weeks', audience: 'Select customers' },
            'ga': { label: 'General Availability', weeks: 'Ongoing', audience: 'Full market' }
        };

        const phase = phases[data.phase] || phases.ga;

        return `
            <div class="output-content">
                <div class="output-section">
                    <h4>🚀 GTM Launch Plan: ${data.product}</h4>
                    <p>Type: <strong>${data.type || 'New Product'}</strong> | Phase: <strong>${phase.label}</strong> | Timeline: <strong>${data.timeline || 'TBD'}</strong></p>
                </div>
                
                <div class="output-section">
                    <h4>📅 Launch Timeline</h4>
                    <ul class="output-list">
                        <li><span>Week 1-2</span><span>Internal alignment & messaging finalization</span></li>
                        <li><span>Week 3-4</span><span>Sales enablement & collateral creation</span></li>
                        <li><span>Week 5-6</span><span>${phase.label} launch to ${phase.audience}</span></li>
                        <li><span>Week 7+</span><span>Iterate based on feedback</span></li>
                    </ul>
                </div>
                
                <div class="output-section">
                    <h4>📢 Channel Messaging</h4>
                    <ul class="output-list">
                        <li><span>Website</span><span>Hero: "Introducing ${data.product} — ${data.goals ? data.goals.substring(0, 40) : 'Your new advantage'}"</span></li>
                        <li><span>Email</span><span>Subject: "[Early Access] ${data.product} is here"</span></li>
                        <li><span>Social</span><span>Thread: "We built ${data.product} because..."</span></li>
                    </ul>
                </div>
                
                <div class="output-section">
                    <h4>🎯 Success Metrics</h4>
                    <p>${data.goals || 'Define clear, measurable outcomes for this launch.'}</p>
                    <ul class="output-list">
                        <li><span>Awareness</span><span>Page views, social mentions, press coverage</span></li>
                        <li><span>Engagement</span><span>Demo requests, sign-ups, trials started</span></li>
                        <li><span>Conversion</span><span>Qualified leads, closed deals, revenue</span></li>
                    </ul>
                </div>
            </div>
        `;
    }

    function generateSegmentProfile(data) {
        const sizes = {
            'startup': 'Startup (1-50 employees)',
            'smb': 'SMB (51-200 employees)',
            'midmarket': 'Mid-Market (201-1000 employees)',
            'enterprise': 'Enterprise (1000+ employees)'
        };

        return `
            <div class="output-content">
                <div class="output-section">
                    <h4>🎯 ICP Definition: ${data.product}</h4>
                    <p>Industry: <strong>${data.industry || 'Cross-industry'}</strong> | Size: <strong>${sizes[data.size] || data.size}</strong></p>
                </div>
                
                <div class="output-section">
                    <h4>👤 Buyer Persona: ${data.role || 'Key Decision Maker'}</h4>
                    <ul class="output-list">
                        <li><span>Title</span><span>${data.role || 'VP / Director level'}</span></li>
                        <li><span>Goals</span><span>Drive efficiency, demonstrate impact, stay competitive</span></li>
                        <li><span>Challenges</span><span>${data.problem || 'Resource constraints, complexity, speed-to-value'}</span></li>
                        <li><span>Buying Triggers</span><span>New initiative, competitive pressure, growth mandate</span></li>
                    </ul>
                </div>
                
                <div class="output-section">
                    <h4>📖 Segment Narrative</h4>
                    <p>${data.role || 'Leaders'} in ${data.industry || 'the industry'} at ${sizes[data.size] || 'growing'} companies face unique challenges: ${data.problem || 'balancing innovation with operational demands'}. <strong>${data.product}</strong> is designed specifically for this reality.</p>
                </div>
                
                <div class="output-section">
                    <h4>📦 Use Case Clusters</h4>
                    <ul class="output-list">
                        <li><span>Primary</span><span>Core workflow optimization</span></li>
                        <li><span>Secondary</span><span>Cross-team alignment</span></li>
                        <li><span>Expansion</span><span>Enterprise-wide rollout</span></li>
                    </ul>
                </div>
            </div>
        `;
    }

    function generateRoadmapStory(data) {
        const audiences = {
            'customer': 'Customer-Facing',
            'investor': 'Investor-Ready',
            'internal': 'Internal Alignment',
            'sales': 'Sales Enablement'
        };

        return `
            <div class="output-content">
                <div class="output-section">
                    <h4>🗺️ Roadmap Story: ${data.feature}</h4>
                    <p>Timeline: <strong>${data.timeline || 'Upcoming'}</strong> | Audience: <strong>${audiences[data.audience] || 'General'}</strong></p>
                </div>
                
                <div class="output-section">
                    <h4>📣 What's Coming</h4>
                    <p><strong>${data.feature}</strong> will ${data.technical ? 'enable ' + data.technical.substring(0, 100) : 'deliver new capabilities'} for our customers.</p>
                </div>
                
                <div class="output-section">
                    <h4>💡 Why It Matters</h4>
                    <p>This investment directly addresses customer feedback and market demand. ${data.audience === 'investor' ? 'It positions us for the next phase of growth.' : 'It will unlock new use cases and value for users.'}</p>
                </div>
                
                <div class="output-section">
                    <h4>👥 Who It's For</h4>
                    <p>${data.audience === 'customer' ? 'All customers will benefit, with particular value for power users and enterprise accounts.' : 'This aligns with our strategic priorities and market positioning.'}</p>
                </div>
                
                <div class="output-section">
                    <h4>🎯 ${audiences[data.audience] || 'General'} Messaging</h4>
                    <p>"${data.timeline ? 'Coming ' + data.timeline : 'Soon'}: ${data.feature} — ${data.technical ? data.technical.substring(0, 60) : 'bringing you more power and flexibility'}."</p>
                </div>
            </div>
        `;
    }

    // ============================================
    // Utility Functions
    // ============================================

    function getPersonaName(persona) {
        const names = {
            'cmo': 'CMOs and VP Marketing leaders',
            'pmm': 'Product Marketing Managers',
            'founder': 'Founders and CEOs',
            'pm': 'Product Managers',
            'sales': 'Sales Leaders'
        };
        return names[persona] || 'decision-makers';
    }

    function getReasonLabel(reason) {
        const labels = {
            'price': 'Price / Budget',
            'features': 'Feature Gap',
            'relationship': 'Existing Relationship',
            'timing': 'Timing / Urgency',
            'trust': 'Trust / Brand',
            'fit': 'Product Fit',
            'other': 'Other Factors'
        };
        return labels[reason] || 'Unknown';
    }

    function showLoading(outputId) {
        const output = document.getElementById(outputId);
        if (output) {
            output.innerHTML = `
                <div class="loading">
                    <div class="loading-spinner"></div>
                    <span class="loading-text">Generating insights...</span>
                </div>
            `;
        }
    }

    function displayOutput(outputId, html) {
        const output = document.getElementById(outputId);
        if (output) {
            output.innerHTML = html;
        }
    }

    function showFormErrors(errors) {
        const messages = Object.values(errors).join('\n');
        showNotification(messages, 'error');
    }

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'error' ? 'var(--color-error)' : type === 'warning' ? 'var(--color-warning)' : 'var(--color-accent-primary)'};
            color: white;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            animation: slideIn 0.3s ease;
            max-width: 400px;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    function incrementStat(statKey) {
        if (AppState.stats.hasOwnProperty(statKey)) {
            AppState.stats[statKey]++;
            updateStatsDisplay();
            saveState();
        }
    }

    function updateStatsDisplay() {
        const statElements = document.querySelectorAll('.stat-value');
        const values = [
            AppState.stats.productStories,
            AppState.stats.battleCards,
            AppState.stats.creativeHooks,
            AppState.stats.gtmPlans
        ];

        statElements.forEach((el, i) => {
            if (values[i] !== undefined) {
                el.textContent = values[i];
            }
        });
    }

    function saveState() {
        NarrativeOSSecurity.storage.set('appState', {
            stats: AppState.stats,
            lastPage: AppState.currentPage
        });
    }

    function loadSavedState() {
        const saved = NarrativeOSSecurity.storage.get('appState');
        if (saved) {
            if (saved.stats) {
                AppState.stats = { ...AppState.stats, ...saved.stats };
                updateStatsDisplay();
            }
        }
    }

    function handleKeyboard(e) {
        // Escape to close mobile sidebar
        if (e.key === 'Escape' && DOM.sidebar.classList.contains('open')) {
            DOM.sidebar.classList.remove('open');
        }

        // Cmd/Ctrl + K for search focus
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }
    }

    // Add CSS for notification animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
