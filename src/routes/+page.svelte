<script lang="ts">
import { onMount } from 'svelte';

const workingCodes = [
    { code: "setrona1vertagzeu0", rewards: "30x Locked Element Reroll, 20x Locked Weapon Reroll, 20x Locked Clan Reroll, 20x Clan Reroll, 2x Locked Blue Elixir, 2x Locked Red Elixir", isNew: true },
    { code: "excaliburfool", rewards: "40x Locked Element Reroll, 30x Locked Weapon Reroll, 25x Locked Clan Reroll, 20x Weapon Appearance Reroll, 2x Locked Blue Elixir, 2x Locked Red Elixir" },
    { code: "higuyscode", rewards: "15x Locked Clan Reroll, 10x Locked Weapon Reroll, 10x Locked Element Reroll" },
    { code: "thisiswhywetestthosewhoknow", rewards: "20x Locked Element Reroll, 20x Eye Colour Reroll, 10x Locked Weapon Reroll, 15x Locked Clan Reroll, 10x Mask Reroll, 10x Mouth Reroll, 1x World Ticket" },
    { code: "goplayranked", rewards: "Game rewards" },
    { code: "somebugsfixes", rewards: "Game rewards" },
    { code: "raidsfixed", rewards: "Game rewards" },
    { code: "thanksforpatience", rewards: "Game rewards" },
    { code: "800kcodeyeah", rewards: "Game rewards" },
    { code: "rerererelease", rewards: "1x Bararaq Extremity, 10x Locked Clan Reroll, 10x Locked Weapon Reroll, 10x Locked Element Reroll" },
    { code: "compensationforinconvenientrelease", rewards: "10x Locked Weapon Reroll, 10x Locked Clan Reroll, 15x Locked Element Reroll" },
    { code: "promiseddecembercode", rewards: "5x Locked Weapon, 5x Locked Clan Reroll, 5x Eyes Reroll, 10x Eyecolor Reroll, 10x Mouth Reroll, 10x Locked Element Reroll" },
    { code: "privateservercompensation", rewards: "1x Bararaq Extremity, 1x World Ticket, 10x Locked Clan Reroll, 10x Weapon Appearance Reroll, 15x Locked Element Reroll" },
    { code: "3daysthosewhoknow", rewards: "1x Bararaq Extremity Wrapped, 5x Locked Element Reroll, 10x Locked Clan Reroll, 10x Locked Weapon Reroll" },
    { code: "sorryforthebankbugs", rewards: "10x Locked Element Reroll, 10x Locked Clan Reroll, 10x Locked Weapon Reroll, 10x Locked Eyes Reroll" },
    { code: "mythoughtsonthislater", rewards: "Game rewards" }
];

const expiredCodes = [
    "100kfavourites", "100mlikes", "10klikes", "1kcristi", "200klikeswoah", "20klikes", 
    "2weekdelaywoah", "300mvisits", "350mvisitsalright", "35klikes", "3shikaireroll", 
    "500kdiscmemberswoo", "500mvisitsthankyou", "55klikes", "700kwoahthanks", 
    "7staredwardnewgate", "80Klikes", "8by2typejole", "abracadabra", "afkworld", 
    "AllAccordingToCake", "almightyeye", "anextracode", "angrycanadian", "anotherbrickedshutdown",
    "apologycode", "apologyforlate", "arrogantecristi5k", "avaricecascade", "avengerlevelthreat",
    "awesomesauce", "badquincy", "balancedbalance", "bararaqgbincident", "Benihimebuff",
    "blazblueincident", "bloodedged", "breathlesspumpkle", "brovisitedhisfriends",
    "canyougiftmeacinmightyomega", "canyouwrap", "causethatstheupdateineed", "cctokenfix",
    "championship", "championshipandmasteryboxes", "clanwarupdate", "code1", "contentcoming",
    "cowoe10k", "cowoenuovaentvari", "cowoesorry", "cristi10k", "cristiqol", "cursedgearruinsfriendships",
    "cyberpoint", "davehashit10kwow", "ddanielisevil", "delayedwhoops", "devilgene",
    "didntyousaynoupdtonight", "doomaroomeneverexisted", "doomatearoom", "drakos10k",
    "eduardobrg", "eduardobrg10k", "eduardocarrying", "entvari10k", "ermwhatthetypesoul",
    "ermwhattthetypesoul", "explodeincident", "fixedoldcode", "flowerfinally", "gokuvsvegetasupersaiyanrapbattlebegin",
    "guesswhosback", "gutteddodgevariantgobrrr", "hakudanerfafter1000years", "happyeaster",
    "happyfortuneentvariblessing", "happyhalloween", "haveagoodday", "hellopiety",
    "helpeduardosmentalsanity", "higuys", "hqrsepowered", "ididntgetopenedupiliterallyjustgottiredofblocking",
    "idontdotheseoften", "imnotnamingitthat", "imsorry", "ineedasacredscrollindemonhuntertm",
    "itstypesoulfriday", "jayomalawfirm", "JEANETTEFOUND", "joedame", "johnbooming", "johnboomingg",
    "joshnosreppcristi", "kamehamehax3", "khaotic10k", "khaoticyachty", "latenightbruh",
    "latenightfightnight", "latenightupdate", "lateupdatesareannoying", "leafystray",
    "letsget500mmore", "lightningshunkoaftertwoyearslol", "lightsegunda", "lockinseason",
    "luisvonmarco", "mahoragathosewhoknow", "mainme", "quickcodeforcodesocodeyescodehowcodewithcode",
    "quickshutdown", "quincyktillmybonesdecay", "quincynerfagainleaveourracealonedude",
    "rankedplswork", "rankedseason2", "readysetboomxdgetitbecauseboomboominokwhateverheresacode",
    "reallycoolcodehaha", "reallycooloriginalcodename", "redeem72024", "resetclan", "robloxban",
    "robotcowoe", "secretcodethatgives1000rerolls", "segundanextupdate", "senkuwascloudkageinjoedame",
    "setroboominda", "setrohadtoguesswhatthiscodewasnamed", "shikaireroll", "shutdownsrry",
    "slowpace", "somethingrandom", "soonupdates", "sorry4ranked3", "sorrybugs", "sorryforbank",
    "sorryfordelays", "sorryforshutdown", "sorryforthat", "sorryfortheinconvenienceee",
    "sorryfortheshutdowns", "sorryhopethishelps", "soulianstreak", "sozforbrick", "sozformobile",
    "spendingthanksgivingontype", "spiritgun", "stefan10kfollowers", "streamericdoa", "sundayupdate",
    "supasta", "tama62121", "tamacodesareback", "tamaforyoutamaforall", "tamaiscool",
    "tamaonetwothreefour", "tamapackageone", "tamarandomcode", "tamastrikesagain", "tamasuigetsu",
    "tamataisentwo", "tamaverified", "tamayaren", "teleportswentdown", "thatoneguyinvcaskedmeforthisonesoblamehim",
    "thegreattypesoultrellolieisrealtyfor10kbtw", "thehonoredone", "thekiraevent", "thekiraeventparttwo",
    "thereisnosuchthing", "theresahiddennpcsomewhere", "therewasnotruebankaiinthefirstplace",
    "thisisnotsigma", "thosewhoknowmango", "threatneutralized", "timetravellermistake", "tradehub",
    "triplethreat", "tsugokusenku", "tweakinpostupdate", "tyforfollows", "updatecomingsoon",
    "veil10k", "visionaryrework", "vultures", "wasitworthit", "watermelon", "weareback",
    "wednesdaypatchesmoreplz", "weekendgiftorsomething", "weloveeduardo", "wereached400mvisits",
    "whatdoesheevendo", "whenwedance", "whereiskendoweapondude", "wheresmybuddy", "whocareswhatthenameis",
    "whodathuh", "whoops", "windwake", "woahreal", "yessirupdatetime", "yippeweekly",
    "youaremyspecialbuddy", "youcanrollraresnow:)", "youdidntexpectheretobeasecondonedidyou", "yurrrrlistenman"
];

let copiedCode: string | null = null;
let searchTerm: string = '';

$: filteredCodes = workingCodes.filter(code => 
    code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.rewards.toLowerCase().includes(searchTerm.toLowerCase())
);

function copyCode(code: string) {
    navigator.clipboard.writeText(code).then(() => {
        copiedCode = code;
        setTimeout(() => {
            if (copiedCode === code) copiedCode = null;
        }, 2000);
    }).catch(() => {
        // 降级方案：如果clipboard API不可用
        const textArea = document.createElement('textarea');
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        copiedCode = code;
        setTimeout(() => {
            if (copiedCode === code) copiedCode = null;
        }, 2000);
    });
}

// 页面加载时执行
onMount(() => {
    // 移除Google Translate相关元素
    const googleTranslateElements = document.querySelectorAll('.goog-te-banner-frame, .goog-te-gadget, .goog-te-combo');
    googleTranslateElements.forEach(el => el.remove());
    
    // 平滑滚动到锚点
    const handleAnchorClick = (e: Event) => {
        const target = e.target as HTMLAnchorElement;
        if (target.hash) {
            e.preventDefault();
            const element = document.querySelector(target.hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };
    
    document.addEventListener('click', handleAnchorClick);
    
    return () => {
        document.removeEventListener('click', handleAnchorClick);
    };
});
</script>

<svelte:head>
    <title>Type Soul Codes - Latest Available Codes August 2025</title>
    <meta name="description" content="Latest Available Codes for Type Soul. Get free rewards like Locked Weapon Rerolls and World Tickets. Updated August 7, 2025." />
</svelte:head>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: linear-gradient(135deg, #93c5fd 0%, #a5b4fc 100%);
        min-height: 100vh;
        color: #000;
    }

    /* 防止Google Translate弹窗 */
    :global(.goog-te-banner-frame) {
        display: none !important;
    }
    
    :global(.goog-te-gadget) {
        display: none !important;
    }
    
    :global(.goog-te-combo) {
        display: none !important;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
    }

    .navbar {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        padding: 1rem 0;
    }

    .navbar-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .navbar-brand {
        font-size: 1.5rem;
        font-weight: 700;
        color: #3b82f6;
        text-decoration: none;
    }

    .navbar-nav {
        display: flex;
        gap: 2rem;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .nav-link {
        color: #000;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s;
    }

    .nav-link:hover {
        color: #3b82f6;
    }

    .hero {
        padding: 120px 0 60px;
        text-align: center;
        color: white;
    }

    .hero-title {
        font-size: 4rem;
        font-weight: 800;
        margin-bottom: 1.5rem;
        text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .hero-subtitle {
        font-size: 1.4rem;
        margin-bottom: 2.5rem;
        opacity: 0.9;
    }

    .hero-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }

    .btn {
        padding: 0.75rem 2rem;
        border-radius: 50px;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.2s;
        border: none;
        cursor: pointer;
        font-size: 1rem;
    }

    .btn-primary {
        background: #3b82f6;
        color: white;
    }

    .btn-primary:hover {
        background: #2563eb;
        transform: translateY(-2px);
    }

    .btn-outline {
        background: transparent;
        color: white;
        border: 2px solid white;
    }

    .btn-outline:hover {
        background: white;
        color: #3b82f6;
    }

    .main-content {
        background: white;
        border-radius: 20px;
        margin: -40px auto 40px;
        padding: 4rem;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        position: relative;
        max-width: 1200px;
        color: #000;
    }
    
    .page-wrapper {
        min-height: 100vh;
        background: linear-gradient(135deg, #93c5fd 0%, #a5b4fc 100%);
        padding: 0 20px;
    }
    
    .content-container {
        max-width: 1400px;
        margin: 0 auto;
        position: relative;
        padding: 0 30px;
    }
    
    /* 在大屏幕上增加侧边栏宽度 */
    @media (min-width: 1400px) {
        .content-container {
            max-width: 1200px;
            padding: 0 60px;
        }
    }
    
    @media (min-width: 1600px) {
        .content-container {
            max-width: 1100px;
            padding: 0 80px;
        }
    }
    
    @media (min-width: 1920px) {
        .content-container {
            max-width: 1300px;
            padding: 0 100px;
        }
    }

    .section {
        margin-bottom: 4rem;
    }

    .section-title {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 2rem;
        color: #000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .new-badge {
        background: #10b981;
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
    }

    .alert {
        background: #dbeafe;
        border: 1px solid #93c5fd;
        border-radius: 12px;
        padding: 1rem;
        margin-bottom: 2rem;
        color: #1e40af;
    }

    .codes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
    }

    .code-card {
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        border: 2px solid #e5e7eb;
        border-radius: 16px;
        padding: 1.5rem;
        transition: all 0.3s;
        position: relative;
        backdrop-filter: blur(10px);
    }

    .code-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        border-color: #3b82f6;
    }

    .code-card.new {
        border-color: #10b981;
        background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
    }

    .code-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .code-text {
        font-family: 'Courier New', monospace;
        font-size: 1.1rem;
        font-weight: 600;
        color: #000;
        background: white;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        border: 1px solid #d1d5db;
    }

    .copy-btn {
        background: #3b82f6;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s;
    }

    .copy-btn:hover {
        background: #2563eb;
    }

    .copy-btn.copied {
        background: #10b981;
    }

    .rewards {
        color: #000;
        font-size: 0.9rem;
        line-height: 1.5;
    }

    .expired-codes {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
    }

    .expired-code {
        background: #f3f4f6;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        padding: 0.75rem;
        text-align: center;
        color: #000;
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
    }

    .info-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
    }

    .info-card {
        background: #f8fafc;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 1.5rem;
        color: #000;
    }

    .info-card h3 {
        color: #000;
        margin-bottom: 1rem;
        font-size: 1.25rem;
    }

    .info-card ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .info-card li {
        padding: 0.5rem 0;
        color: #000;
        border-bottom: 1px solid #f3f4f6;
    }

    .info-card li:last-child {
        border-bottom: none;
    }
    
    .stats {
        display: flex;
        gap: 1rem;
        justify-content: space-around;
    }
    
    .stat-item {
        text-align: center;
        flex: 1;
    }
    
    .stat-number {
        display: block;
        font-size: 2rem;
        font-weight: 700;
        color: #3b82f6;
        line-height: 1;
    }
    
    .stat-label {
        display: block;
        font-size: 0.9rem;
        color: #000;
        margin-top: 0.5rem;
    }
    
    .search-container {
        margin-bottom: 2rem;
    }
    
    .search-input {
        width: 100%;
        padding: 1rem;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        font-size: 1rem;
        background: white;
        color: #000;
        transition: border-color 0.2s;
    }
    
    .search-input:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .search-stats {
        margin-top: 0.5rem;
        font-size: 0.9rem;
        color: #6b7280;
        text-align: center;
    }
    
    .no-results {
        text-align: center;
        padding: 2rem;
        color: #6b7280;
        background: #f9fafb;
        border-radius: 12px;
        margin-top: 1rem;
    }

    @media (max-width: 768px) {
        .hero-title {
            font-size: 2.5rem;
        }

        .navbar-nav {
            display: none;
        }

        .main-content {
            margin: -20px 10px 40px;
            padding: 2rem 1.5rem;
        }

        .codes-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
        }

        .hero-buttons {
            flex-direction: column;
            align-items: center;
        }
        
        .info-cards {
            grid-template-columns: 1fr;
            gap: 1rem;
        }
        
        .expired-codes {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        }
        
        .content-container {
            padding: 0 10px;
        }
        
        .page-wrapper {
            padding: 0 10px;
        }
        
        .search-input {
            padding: 0.75rem;
            font-size: 0.9rem;
        }
        
        .stats {
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .section-title {
            font-size: 2rem;
        }
    }
    
    /* 改善可访问性 */
    .nav-link:focus,
    .btn:focus,
    .copy-btn:focus {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
    }
    
    /* 改善加载性能 */
    .code-card {
        will-change: transform;
    }
    
    /* 改善打印样式 */
    @media print {
        .navbar,
        .hero-buttons,
        .copy-btn {
            display: none !important;
        }
        
        .main-content {
            box-shadow: none;
            margin: 0;
        }
    }
    
    /* 确保所有文本都是黑色 */
    .section p,
    .info-card p,
    .alert p {
        color: #000 !important;
    }
    
    /* 确保列表项文本是黑色 */
    .info-card ul li {
        color: #000 !important;
    }
    
    /* 确保段落文本是黑色 */
    .section p {
        color: #000 !important;
        line-height: 1.6;
    }
</style>

<nav class="navbar">
    <div class="container">
        <div class="navbar-content">
            <a href="/" class="navbar-brand">Type Soul Codes</a>
            <ul class="navbar-nav">
                <li><a href="/#codes" class="nav-link">Codes</a></li>
                <li><a href="/#how-to" class="nav-link">How to Use</a></li>
                <li><a href="/#expired" class="nav-link">Expired Codes</a></li>
                <li><a href="/#about" class="nav-link">About Game</a></li>
                <li><a href="about-us.html" class="nav-link">About Us</a></li>
            </ul>
        </div>
    </div>
</nav>

<section class="hero">
    <div class="container">
        <h1 class="hero-title">Type Soul Codes</h1>
        <p class="hero-subtitle">Latest Available Codes August 2025 - Get Free Game Rewards</p>
        <div class="hero-buttons">
            <a href="about-us.html" class="btn btn-outline">About Us</a>
            <a href="/#codes" class="btn btn-primary">View Codes</a>
        </div>
    </div>
</section>

<div class="page-wrapper">
    <div class="content-container">
        <div class="main-content">
        <div class="info-cards">
            <div class="info-card">
                <h3>Important Notes</h3>
                <ul>
                    <li>Codes may expire anytime</li>
                    <li>Each code can only be used once</li>
                    <li>Some codes have level requirements</li>
                    <li>Use them promptly</li>
                </ul>
            </div>
            <div class="info-card">
                <h3>Quick Stats</h3>
                <div class="stats">
                    <div class="stat-item">
                        <span class="stat-number">{workingCodes.length}</span>
                        <span class="stat-label">Working Codes</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">{expiredCodes.length}</span>
                        <span class="stat-label">Expired Codes</span>
                    </div>
                </div>
            </div>
        </div>

        <section id="codes" class="section">
            <h2 class="section-title">
                Latest Available Codes
                <span class="new-badge">NEW</span>
            </h2>
            
            <div class="alert">
                <strong>Important:</strong> These codes are currently working. Use them before they expire!
            </div>
            
            <div class="search-container">
                <input 
                    type="text" 
                    placeholder="Search codes..." 
                    class="search-input"
                    bind:value={searchTerm}
                />
                <div class="search-stats">
                    Showing {filteredCodes.length} of {workingCodes.length} codes
                </div>
            </div>

            <div class="codes-grid">
                {#each filteredCodes as code}
                    <div class="code-card {code.isNew ? 'new' : ''}">
                        <div class="code-header">
                            <span class="code-text">{code.code}</span>
                            <button 
                                class="copy-btn {copiedCode === code.code ? 'copied' : ''}"
                                on:click={() => copyCode(code.code)}
                            >
                                {copiedCode === code.code ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <div class="rewards">
                            <strong>Rewards:</strong> {code.rewards}
                        </div>
                    </div>
                {/each}
            </div>
            
            {#if filteredCodes.length === 0 && searchTerm}
                <div class="no-results">
                    <p>No codes found matching "{searchTerm}". Try a different search term.</p>
                </div>
	{/if}
        </section>

        <section id="expired" class="section">
            <h2 class="section-title">Expired Codes</h2>
            <p>These codes are no longer working:</p>
            <div class="expired-codes">
                {#each expiredCodes as code}
                    <div class="expired-code">{code}</div>
                {/each}
            </div>
        </section>

        <section id="how-to" class="section">
            <h2 class="section-title">How to Use Codes</h2>
            <div class="info-cards">
                <div class="info-card">
                    <h3>Step 1</h3>
                    <p>Launch Type Soul in Roblox</p>
                </div>
                <div class="info-card">
                    <h3>Step 2</h3>
                    <p>Create a character and level up to at least Semi-Grade 2</p>
                </div>
                <div class="info-card">
                    <h3>Step 3</h3>
                    <p>Select the gift box button at the top of your screen</p>
                </div>
                <div class="info-card">
                    <h3>Step 4</h3>
                    <p>Type a code and press Enter to redeem</p>
                </div>
            </div>
        </section>

        <section id="about" class="section">
            <h2 class="section-title">About Type Soul</h2>
            <div class="info-card">
                <p>Type Soul is a Roblox action-adventure game where you'll use your skills, such as a reaper or monster transformation, to fight enemies. You'll also want to have a good weapon by your side! The Type Soul codes can be useful in building up your character for even greater fights.</p>
                <p>In Type Soul, you can choose different factions (Shinigami, Hollow, Quincy) and experience rich PVE and PVP gameplay. Through collecting soul tickets, unlocking skills, and participating in large-scale events, enjoy immersive combat and growth fun.</p>
                <p>Codes are an important way to obtain in-game rewards, including weapon reset tickets, element reset tickets, soul tickets and other precious items.</p>
            </div>
        </section>
        </div>
    </div>
</div>