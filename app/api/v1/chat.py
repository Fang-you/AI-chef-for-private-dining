from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.models.schemas import ChatRequest
from app.agent.personal_chief import agent
from langchain_core.messages import HumanMessage
from typing import Dict, List

router = APIRouter()

# 内存存储对话历史 {thread_id: [messages]}
chat_history: Dict[str, List[dict]] = {}


@router.post("/chat/stream")
async def chat_endpoint(request: ChatRequest):
    """流式对话"""

    async def generate():
        try:
            # 构建消息内容
            if request.image_url:
                # 如果有图片，构建多模态消息
                content = [
                    {"type": "text", "text": request.message},
                    {"type": "image_url", "image_url": {"url": request.image_url}}
                ]
            else:
                content = request.message

            # 获取历史消息
            history = chat_history.get(request.thread_id, [])

            # 构建消息列表
            messages = []
            for msg in history:
                if msg["role"] == "user":
                    messages.append(HumanMessage(content=msg["content"]))
                # AI消息会被agent自动处理

            # 添加当前消息
            messages.append(HumanMessage(content=content))

            # 调用agent流式生成
            full_response = ""
            async for event in agent.astream_events(
                {"messages": messages},
                version="v2"
            ):
                # 处理不同类型的事件
                if event["event"] == "on_chat_model_stream":
                    chunk = event["data"]["chunk"]
                    if hasattr(chunk, "content") and chunk.content:
                        full_response += chunk.content
                        yield chunk.content

            # 保存对话历史
            if request.thread_id not in chat_history:
                chat_history[request.thread_id] = []

            chat_history[request.thread_id].append({
                "role": "user",
                "content": request.message,
                "image_url": request.image_url
            })
            chat_history[request.thread_id].append({
                "role": "assistant",
                "content": full_response
            })

            yield ""

        except Exception as e:
            error_msg = f"Error: {str(e)}"
            yield f"\n\n{error_msg}"

    return StreamingResponse(
        generate(),
        media_type="text/plain; charset=utf-8",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )


@router.get("/chat/messages")
async def get_chat_messages(thread_id: str):
    """获取历史消息"""
    messages = chat_history.get(thread_id, [])
    return {"messages": messages}


@router.delete("/chat/messages")
async def clear_chat_messages(thread_id: str):
    """清空历史消息"""
    if thread_id in chat_history:
        del chat_history[thread_id]
    return {"success": True}