"use client"
import { ArrowLeft, Share2, Bookmark, MessageSquare, ThumbsUp, Clock, Calendar, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Header from "@/components/header"
import { useRouter } from "next/navigation"
import PageBackground from "@/components/page-background"
import React from "react"

// 定义新闻项的类型
interface NewsItem {
  id: number
  title: string
  image: string
  source: string
  author: string
  publishDate: string
  publishTime: string
  category: string
  premium: boolean
  likes: number
  comments: number
  content: string
  relatedNews: RelatedNews[]
}

// 定义相关新闻的类型
interface RelatedNews {
  id: number
  title: string
}

// 定义参数类型
interface NewsParams {
  id: string
}

// 模拟新闻数据库
const newsDatabase: Record<number, NewsItem> = {
  1: {
    id: 1,
    title: "央行发布2023年第四季度货币政策执行报告，强调稳健货币政策",
    image:
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80",
    source: "央行新闻",
    author: "李金融",
    publishDate: "2024-03-10",
    publishTime: "10:30",
    category: "policy",
    premium: true,
    likes: 256,
    comments: 48,
    content: `
      <p>中国人民银行今日发布2023年第四季度货币政策执行报告，报告强调将继续实施稳健的货币政策，灵活适度，加大对实体经济的支持力度，保持流动性合理充裕。</p>
      
      <p>报告指出，2023年第四季度，面对复杂严峻的国际环境和国内经济恢复中的困难挑战，人民银行坚持稳中求进工作总基调，完整、准确、全面贯彻新发展理念，加快构建新发展格局，着力推动高质量发展，整体物价水平保持基本稳定，就业形势总体改善，国际收支保持基本平衡，经济运行持续恢复向好。</p>
      
      <p>报告显示，2023年第四季度末，广义货币(M2)余额同比增长9.7%，社会融资规模存量同比增长9.5%，与名义经济增速基本匹配。人民币贷款增加22.75万亿元，同比多增1.88万亿元。</p>
      
      <p>在金融支持实体经济方面，报告提到，2023年第四季度，金融对实体经济的支持力度持续加大。制造业中长期贷款保持较快增长，普惠小微贷款增速明显高于各项贷款增速，绿色贷款、科技贷款等重点领域贷款增长较快。</p>
      
      <p>报告强调，下一阶段，人民银行将坚持稳字当头、稳中求进，继续实施稳健的货币政策。保持流动性合理充裕，保持货币供应量和社会融资规模增速同名义经济增速基本匹配，保持宏观杠杆率基本稳定。</p>
      
      <p>同时，进一步疏通货币政策传导机制，发挥好结构性货币政策工具的牵引带动作用，引导金融机构加大对科技创新、绿色发展、普惠小微、乡村振兴等重点领域和薄弱环节的支持力度。</p>
      
      <p>此外，报告还提到将深化利率市场化改革，完善市场化利率形成和传导机制，推动降低企业综合融资成本。同时，保持人民币汇率在合理均衡水平上的基本稳定。</p>
      
      <p>分析人士认为，此次报告释放了积极信号，表明央行将继续通过稳健的货币政策为经济恢复提供有力支持，同时注重防范金融风险，促进经济高质量发展。</p>
    `,
    relatedNews: [
      { id: 3, title: "数字经济新政出台，科技股有望迎来新一轮上涨" },
      { id: 6, title: "房地产市场调控政策持续优化，一线城市成交量回暖" },
      { id: 8, title: "银行业一季度净利润增长稳健，不良贷款率小幅下降" },
    ],
  },
  2: {
    id: 2,
    title: "美联储主席鲍威尔暗示年内或将降息，全球市场迎来利好",
    image:
      "https://images.unsplash.com/photo-1607921072916-f83192dba91c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80",
    source: "国际财经",
    author: "王环球",
    publishDate: "2024-03-10",
    publishTime: "08:45",
    category: "global",
    premium: false,
    likes: 189,
    comments: 37,
    content: `
      <p>美联储主席杰罗姆·鲍威尔在最新讲话中表示，如果通胀持续下降，年内可能会考虑降息，这一表态引发全球市场积极反应。</p>
      
      <p>在昨日举行的经济政策研讨会上，鲍威尔指出，近几个月来美国通胀数据显示出持续下降的趋势，如果这一趋势能够保持，美联储将有足够的信心开始放松货币政策。他强调，任何降息决定都将基于经济数据的综合评估，而非预设的时间表。</p>
      
      <p>"我们需要看到更多的良好数据，以增强我们对通胀持续向2%目标回落的信心，"鲍威尔说，"如果经济基本按照预期发展，那么在今年某个时候开始降低政策限制性程度可能是适当的。"</p>
      
      <p>市场对鲍威尔的讲话反应积极。美国三大股指全线上涨，道琼斯工业平均指数上涨1.2%，标普500指数上涨1.4%，纳斯达克综合指数上涨1.7%。同时，美国10年期国债收益率下降，美元指数走弱。</p>
      
      <p>亚太市场今日开盘也普遍走高，日经225指数上涨1.5%，韩国综合指数上涨1.3%，澳大利亚ASX200指数上涨0.9%。中国香港恒生指数开盘上涨1.8%，A股市场也有望受到积极影响。</p>
      
      <p>分析师指出，鲍威尔的讲话比市场预期的更加"鸽派"，这增强了投资者对美联储今年可能降息的预期。根据芝加哥商品交易所的FedWatch工具，市场目前预计美联储今年将降息3-4次，首次降息可能在6月份的会议上。</p>
      
      <p>不过，也有分析师提醒，虽然鲍威尔的言论提振了市场情绪，但美联储的实际行动仍将取决于未来几个月的经济数据，特别是通胀和就业数据。如果通胀反弹或就业市场过热，美联储可能会推迟降息计划。</p>
      
      <p>对于全球经济而言，美联储转向宽松货币政策将是一个重要的转折点，有望缓解全球流动性压力，为新兴市场国家提供更大的政策空间，促进全球经济复苏。</p>
    `,
    relatedNews: [
      { id: 4, title: "上市公司一季度业绩普遍向好，消费板块表现亮眼" },
      { id: 7, title: "全球大宗商品价格波动加剧，黄金创历史新高" },
      { id: 10, title: "跨境电商新规实施，进出口贸易迎来新变化" },
    ],
  },
  3: {
    id: 3,
    title: "数字经济新政出台，科技股有望迎来新一轮上涨",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80",
    source: "政策解读",
    author: "张科技",
    publishDate: "2024-03-10",
    publishTime: "06:15",
    category: "tech",
    premium: false,
    likes: 215,
    comments: 42,
    content: `
      <p>国家发改委等多部门联合发布数字经济发展新政策，加大对人工智能、大数据等领域的支持力度，科技股有望受益。</p>
      
      <p>据悉，这份题为《关于加快数字经济发展的指导意见》的文件由国家发改委、工信部、科技部等八部门联合印发，旨在推动数字经济和实体经济深度融合，培育经济发展新动能。</p>
      
      <p>《指导意见》提出，到2025年，数字经济核心产业增加值占GDP比重达到10%以上，数字化研发设计工具普及率达到85%，大型工业企业关键工序数控化率达到68%，数字经济相关产业就业人数超过6000万。</p>
      
      <p>在具体措施方面，《指导意见》提出了五大重点任务：</p>
      
      <p>一是加强数字技术创新。支持人工智能、量子信息、区块链等前沿技术研发，推动关键核心技术突破。设立国家数字经济创新发展基金，引导社会资本加大投入。</p>
    `,
    relatedNews: [], // 添加空数组作为默认值
  },
  4: {
    id: 4,
    title: "上市公司一季度业绩普遍向好，消费板块表现亮眼",
    image:
      "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80",
    source: "市场分析",
    author: "赵财富",
    publishDate: "2024-03-09",
    publishTime: "14:30",
    category: "market",
    premium: true,
    likes: 178,
    comments: 35,
    content: `
      <p>截至目前，已有超过60%的上市公司发布一季度业绩预告，整体呈现向好趋势，其中消费板块表现尤为亮眼。</p>
      
      <p>根据统计数据显示，在已发布业绩预告的上市公司中，约有70%的公司预计一季度业绩同比增长，其中25%的公司预计增长幅度超过50%。消费、医药、新能源等板块的上市公司业绩表现普遍较好，反映出这些行业在经济复苏过程中的领先地位。</p>
      
      <p>消费板块中，食品饮料、家电、商贸零售等细分行业的上市公司业绩增长明显。多家龙头企业一季度营收和净利润双双实现两位数增长，超出市场预期。分析人士指出，这主要得益于消费需求的持续恢复和企业经营效率的提升。</p>
      
      <p>某证券研究所首席分析师王明表示："随着居民消费信心逐步恢复，加上节假日消费旺季的带动，一季度消费市场整体呈现回暖态势。特别是高端消费品和服务消费领域，增长势头更为强劲。"</p>
      
      <p>除消费板块外，医药健康行业也表现不俗。多家医药企业一季度业绩预增，尤其是创新药企业和医疗器械公司，受益于医保支付改革和创新药审批加速，业绩增长显著。</p>
      
      <p>新能源产业链上市公司业绩分化明显。上游原材料企业受价格波动影响，业绩增长承压；而中下游设备制造和应用端企业，得益于国内外市场需求扩大，业绩普遍向好。</p>
      
      <p>值得注意的是，部分传统周期性行业如钢铁、有色金属等，受供需关系和价格因素影响，业绩表现不及预期。房地产及相关产业链企业业绩仍面临较大压力，多数企业预计一季度业绩同比下滑。</p>
      
      <p>市场分析师认为，上市公司一季度业绩整体向好，反映出中国经济复苏态势良好，为资本市场提供了坚实的基本面支撑。随着更多公司正式披露一季报，市场有望迎来结构性投资机会，建议投资者重点关注业绩确定性强、成长性好的优质企业。</p>
    `,
    relatedNews: [
      { id: 2, title: "美联储主席鲍威尔暗示年内或将降息，全球市场迎来利好" },
      { id: 5, title: "新能源汽车销量持续攀升，相关概念股表现强劲" },
      { id: 10, title: "银行业一季度净利润增长稳健，不良贷款率小幅下降" },
    ],
  },
  5: {
    id: 5,
    title: "新能源汽车销量持续攀升，相关概念股表现强劲",
    image:
      "https://images.unsplash.com/photo-1593941707882-a56bbc8ba7a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80",
    source: "行业分析",
    author: "李产业",
    publishDate: "2024-03-09",
    publishTime: "10:45",
    category: "industry",
    premium: false,
    likes: 203,
    comments: 47,
    content: `
      <p>随着新能源汽车渗透率持续提升，产业链上下游企业纷纷加大投资力度，电池、芯片等核心零部件领域竞争加剧。</p>
      
      <p>据中国汽车工业协会最新数据显示，今年前两个月，我国新能源汽车产销分别完成121.5万辆和118.3万辆，同比分别增长28.2%和29.4%，市场渗透率达到27.8%。业内专家预计，全年新能源汽车销量有望突破1000万辆，市场渗透率将超过30%。</p>
      
      <p>在政策支持和市场需求双重驱动下，新能源汽车产业链上下游企业纷纷加大投资和研发力度。动力电池领域，多家头部企业宣布扩产计划，预计未来三年国内动力电池产能将翻一番。与此同时，电池技术创新步伐加快，固态电池、钠离子电池等新技术取得突破性进展。</p>
      
      <p>车规级芯片领域，国产替代进程加速。多家半导体企业加大对车规级MCU、SiC功率器件等产品的研发投入，部分产品已实现小批量供货。业内人士表示，随着国产芯片技术水平提升和产能释放，未来三年国产车规级芯片市场份额有望从目前的不足20%提升至40%以上。</p>
      
      <p>智能驾驶技术成为各大车企竞争的焦点。据不完全统计，目前国内已有超过20家车企推出搭载L2级以上自动驾驶功能的车型，部分头部企业已开始测试L3级自动驾驶技术。智能驾驶软硬件供应商受益于市场扩大，业绩普遍实现高速增长。</p>
      
      <p>资本市场方面，新能源汽车产业链相关概念股表现强劲。Wind新能源汽车指数今年以来上涨超过15%，跑赢大盘。其中，动力电池、电驱动、智能驾驶等细分领域的龙头企业股价涨幅明显，部分公司市值创历史新高。</p>
      
      <p>分析师指出，随着新能源汽车市场竞争加剧，产业链面临结构性调整，具有核心技术和规模优势的龙头企业将获得更多市场份额。投资者应关注具备技术创新能力、客户资源优势和成本控制能力的优质企业，警惕产能过剩和价格战风险。</p>
      
      <p>展望未来，随着充电基础设施不断完善、电池技术持续进步和消费者接受度提高，新能源汽车市场有望保持快速增长态势。同时，智能化、网联化将成为行业发展的重要方向，为相关企业带来新的增长机遇。</p>
    `,
    relatedNews: [
      { id: 3, title: "数字经济新政出台，科技股有望迎来新一轮上涨" },
      { id: 6, title: "国际油价波动加剧，能源板块投资策略分析" },
      { id: 9, title: "全球大宗商品价格波动加剧，黄金创历史新高" },
    ],
  },
  6: {
    id: 6,
    title: "房地产市场调控政策持续优化，一线城市成交量回暖",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80",
    source: "房产动态",
    author: "陈地产",
    publishDate: "2024-03-08",
    publishTime: "16:20",
    category: "property",
    premium: true,
    likes: 167,
    comments: 53,
    content: `
      <p>近期多地出台房地产市场支持政策，一线城市新房和二手房成交量环比上升，市场信心逐步恢复。</p>
      
      <p>据不完全统计，今年以来全国已有超过30个城市出台或调整房地产市场相关政策，主要集中在优化限购限贷、降低首付比例、提供购房补贴等方面。其中，一线城市和部分热点二线城市的政策调整力度较大，对市场恢复起到积极作用。</p>
      
      <p>某房地产研究机构数据显示，2月份一线城市新房成交面积环比增长12.3%，二手房成交量环比增长15.7%，均创近半年新高。北京、上海、广州、深圳四个一线城市的房价环比小幅上涨，市场预期逐步改善。</p>
      
      <p>中央经济工作会议强调"推动房地产业向新发展模式平稳过渡"，为行业转型指明方向。近期，住建部等多部门联合发文，提出加快培育和发展住房租赁市场，完善长租房政策，支持专业化、规模化住房租赁企业发展。</p>
      
      <p>在此背景下，多家房企加快向"房住不炒"新发展模式转型。一方面，加大租赁住房业务布局；另一方面，积极拓展物业管理、商业运营、养老地产等服务型业务，优化收入结构。</p>
      
      <p>金融支持方面，央行近期下调支持性再贷款利率，引导金融机构降低房贷利率，支持刚性和改善性住房需求。多家国有大型银行已下调首套和二套住房贷款利率，部分城市首套房贷款利率降至3.8%左右的历史低位。</p>
      
      <p>业内专家表示，当前房地产市场已现企稳迹象，但复苏基础仍不牢固，区域分化明显。一线城市和核心二线城市受益于人口流入和产业支撑，市场恢复较快；而部分三四线城市受人口流出影响，去库存压力仍然较大。</p>
      
      <p>展望未来，随着政策效应逐步显现和市场信心恢复，预计今年房地产市场有望实现企稳回升，但难以出现大幅反弹。行业将加速向高质量发展转型，优质资产和优质企业将获得更多市场和资源。投资者应关注具备优质土地储备、财务稳健、转型能力强的龙头房企。</p>
    `,
    relatedNews: [
      { id: 1, title: "央行发布2023年第四季度货币政策执行报告，强调稳健货币政策" },
      { id: 4, title: "上市公司一季度业绩普遍向好，消费板块表现亮眼" },
      { id: 10, title: "银行业一季度净利润增长稳健，不良贷款率小幅下降" },
    ],
  },
}

export default function NewsDetailPage({ params }: { params: Promise<NewsParams> }) {
  const router = useRouter()
  // 使用 React.use() 解包 params
  const unwrappedParams = React.use(params)
  const newsId = Number.parseInt(unwrappedParams.id)
  const newsItem = newsDatabase[newsId]

  if (!newsItem) {
    return <div>新闻不存在</div>
  }

  return (
    <PageBackground>
      <div className="flex flex-col min-h-screen relative">
      <Header
        title="资讯详情"
        centerTitle={true}
        showBell={false}
        showLogo={false}
        leftComponent={
          <Link href="/news" className="mr-4">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
        }
      />

      {/* 内容区域 */}
      <div className="px-4 py-4 relative z-10">
        <Card className="mb-4 bg-white">
          <CardContent className="p-4">
            <h1 className="text-2xl font-bold mb-2">{newsItem.title}</h1>
            <div className="flex items-center text-gray-500 text-sm mb-3">
              <span>{newsItem.source}</span>
              <span className="mx-2">•</span>
              <span>{newsItem.author}</span>
              <span className="mx-2">•</span>
              <span>
                <Calendar className="inline-block mr-1" size={12} />
                {newsItem.publishDate}
              </span>
              <span className="mx-2">•</span>
              <span>
                <Clock className="inline-block mr-1" size={12} />
                {newsItem.publishTime}
              </span>
            </div>
            <img src={newsItem.image || "/placeholder.svg"} alt={newsItem.title} className="w-full rounded-md mb-3" />
            <div dangerouslySetInnerHTML={{ __html: newsItem.content }} className="text-gray-700" />
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Button variant="outline" size="sm" className="mr-2">
              <ThumbsUp className="mr-2 h-4 w-4" />
              {newsItem.likes}
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="mr-2 h-4 w-4" />
              {newsItem.comments}
            </Button>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="mr-2">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">相关新闻</h2>
            {/* 添加对 relatedNews 的检查，确保它存在且是数组 */}
            {newsItem.relatedNews && newsItem.relatedNews.length > 0 ? (
              newsItem.relatedNews.map((related: RelatedNews) => (
            <Card key={related.id} className="mb-2 bg-white">
              <CardContent className="p-3">
                <Link href={`/news/${related.id}`} className="block hover:underline">
                  {related.title}
                </Link>
              </CardContent>
            </Card>
              ))
            ) : (
              <Card className="mb-2 bg-white">
                <CardContent className="p-3 text-gray-500">
                  暂无相关新闻
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageBackground>
  )
}

