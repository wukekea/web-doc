<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useAppStore } from "@/stores/app";

// 宠物状态类型
type PetState = "idle" | "walking" | "jumping" | "sleeping" | "happy";
type PetDirection = "left" | "right";

interface PetPosition {
  x: number;
  y: number;
}

const appStore = useAppStore();

// 宠物状态
const isVisible = ref(true);
const petState = ref<PetState>("idle");
const petDirection = ref<PetDirection>("right");
const position = ref<PetPosition>({ x: 50, y: window.innerHeight - 120 });
const targetPosition = ref<PetPosition>({ x: 50, y: window.innerHeight - 120 });
const isDragging = ref(false);
const dragOffset = ref<PetPosition>({ x: 0, y: 0 });
const animationFrameId = ref<number | null>(null);
const stateTimer = ref<number | null>(null);

// 宠物配置
const PET_SIZE = 80;
const JUMP_DURATION = 800;
const WALK_DURATION = 3000;
const IDLE_DURATION = 4000;
const SLEEP_DURATION = 8000;
const HAPPY_DURATION = 1500;

// 当前主题
const isDark = computed(() => appStore.theme === "dark");

// 宠物颜色 - 根据主题变化
const petColors = computed(() => ({
  body: isDark.value ? "#a78bfa" : "#8b5cf6",
  bodyGradient: isDark.value ? "#c4b5fd" : "#a78bfa",
  face: isDark.value ? "#1f2937" : "#ffffff",
  eyes: isDark.value ? "#fbbf24" : "#1f2937",
  cheeks: isDark.value ? "#f472b6" : "#fda4af",
  shadow: isDark.value ? "rgba(167, 139, 250, 0.3)" : "rgba(139, 92, 246, 0.2)",
}));

// 随机移动到新位置
function moveToRandomPosition() {
  if (petState.value === "sleeping" || petState.value === "happy") return;

  const maxX = window.innerWidth - PET_SIZE;
  const maxY = window.innerHeight - PET_SIZE - 20;

  targetPosition.value = {
    x: Math.random() * maxX,
    y: Math.random() * (maxY - 100) + 100,
  };

  // 根据移动方向设置朝向
  petDirection.value =
    targetPosition.value.x > position.value.x ? "right" : "left";

  petState.value = "walking";

  // 移动完成后进入空闲状态
  setTimeout(() => {
    if (petState.value === "walking") {
      changeState("idle");
    }
  }, WALK_DURATION);
}

// 改变宠物状态
function changeState(newState: PetState) {
  petState.value = newState;

  // 清除之前的定时器
  if (stateTimer.value) {
    clearTimeout(stateTimer.value);
  }

  // 设置新状态的持续时间
  switch (newState) {
    case "idle":
      stateTimer.value = window.setTimeout(() => {
        if (!isDragging.value) {
          const random = Math.random();
          if (random < 0.3) {
            changeState("sleeping");
          } else if (random < 0.6) {
            changeState("jumping");
          } else {
            moveToRandomPosition();
          }
        }
      }, IDLE_DURATION);
      break;
    case "sleeping":
      stateTimer.value = window.setTimeout(() => {
        changeState("idle");
      }, SLEEP_DURATION);
      break;
    case "jumping":
      setTimeout(() => {
        changeState("idle");
      }, JUMP_DURATION);
      break;
    case "happy":
      stateTimer.value = window.setTimeout(() => {
        changeState("idle");
      }, HAPPY_DURATION);
      break;
  }
}

// 点击宠物
function handlePetClick() {
  // 如果正在拖动，不处理点击
  if (isDragging.value) return;

  if (petState.value !== "sleeping") {
    changeState("happy");
  }
}

// 开始拖动
function handleDragStart(e: MouseEvent) {
  if (petState.value === "sleeping" || petState.value === "happy") return;

  isDragging.value = true;

  // 计算鼠标相对于宠物位置的偏移
  dragOffset.value = {
    x: e.clientX - position.value.x,
    y: e.clientY - position.value.y,
  };

  // 暂停状态定时器
  if (stateTimer.value) {
    clearTimeout(stateTimer.value);
  }

  petState.value = "walking";

  // 添加全局鼠标事件监听
  window.addEventListener("mousemove", handleDragging);
  window.addEventListener("mouseup", handleDragEnd);
}

// 拖动中
function handleDragging(e: MouseEvent) {
  if (!isDragging.value || !isVisible.value) return;

  const mouseX = e.clientX;
  const mouseY = e.clientY;

  // 根据移动方向设置朝向
  petDirection.value = mouseX > position.value.x ? "right" : "left";

  // 更新位置
  position.value = {
    x: mouseX - dragOffset.value.x,
    y: mouseY - dragOffset.value.y,
  };

  // 同时更新目标位置，防止动画循环将宠物移回原位置
  targetPosition.value = { ...position.value };

  // 限制在窗口范围内
  const maxX = window.innerWidth - PET_SIZE;
  const maxY = window.innerHeight - PET_SIZE - 20;

  if (position.value.x < 0) position.value.x = 0;
  if (position.value.x > maxX) position.value.x = maxX;
  if (position.value.y < 60) position.value.y = 60; // 留出工具栏空间
  if (position.value.y > maxY) position.value.y = maxY;
}

// 结束拖动
function handleDragEnd() {
  if (!isDragging.value) return;

  isDragging.value = false;

  // 确保目标位置等于当前位置
  targetPosition.value = { ...position.value };

  // 移除全局事件监听
  window.removeEventListener("mousemove", handleDragging);
  window.removeEventListener("mouseup", handleDragEnd);

  // 恢复空闲状态
  changeState("idle");
}

// 动画循环
function animate() {
  if (isVisible.value) {
    // 平滑移动到目标位置
    const dx = targetPosition.value.x - position.value.x;
    const dy = targetPosition.value.y - position.value.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 5) {
      position.value.x += dx * 0.05;
      position.value.y += dy * 0.05;
    }
  }

  animationFrameId.value = requestAnimationFrame(animate);
}

// 切换宠物显示
function togglePet() {
  isVisible.value = !isVisible.value;
  if (!isVisible.value) {
    if (animationFrameId.value) {
      cancelAnimationFrame(animationFrameId.value);
    }
    if (stateTimer.value) {
      clearTimeout(stateTimer.value);
    }
  } else {
    animate();
    changeState("idle");
  }
}

// 监听窗口大小变化
function handleResize() {
  const maxX = window.innerWidth - PET_SIZE;
  const maxY = window.innerHeight - PET_SIZE - 20;

  if (position.value.x > maxX) {
    position.value.x = maxX;
  }
  if (position.value.y > maxY) {
    position.value.y = maxY;
  }
}

// 初始化
onMounted(() => {
  // 从存储加载宠物状态
  const savedState = localStorage.getItem("pet-visibility");
  if (savedState !== null) {
    isVisible.value = savedState === "true";
  }

  if (isVisible.value) {
    animate();
    // 延迟开始状态循环
    setTimeout(() => {
      changeState("idle");
    }, 1000);
  }

  // 添加事件监听
  window.addEventListener("resize", handleResize);

  // 暴露全局方法
  (window as any).togglePet = togglePet;
});

// 清理
onBeforeUnmount(() => {
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value);
  }
  if (stateTimer.value) {
    clearTimeout(stateTimer.value);
  }
  window.removeEventListener("resize", handleResize);
  window.removeEventListener("mousemove", handleDragging);
  window.removeEventListener("mouseup", handleDragEnd);
});

// 监听可见性变化，保存到存储
watch(isVisible, (value) => {
  localStorage.setItem("pet-visibility", String(value));
});

// 暴露方法供外部调用
defineExpose({
  togglePet,
  isVisible,
});
</script>

<template>
  <div
    v-if="isVisible"
    class="desktop-pet"
    :class="[`pet-${petState}`, `pet-${petDirection}`]"
  >
    <!-- 宠物容器 -->
    <div
      class="pet-container"
      :class="{ 'is-dragging': isDragging }"
      :style="{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }"
      @mousedown="handleDragStart"
      @click="handlePetClick"
      title="拖动：移动位置 | 单击：开心"
    >
      <!-- 阴影 -->
      <div class="pet-shadow"></div>

      <!-- 宠物主体 -->
      <div class="pet-body">
        <!-- 身体渐变 -->
        <div class="pet-body-gradient"></div>

        <!-- 耳朵 -->
        <div class="pet-ear ear-left"></div>
        <div class="pet-ear ear-right"></div>

        <!-- 脸部 -->
        <div class="pet-face">
          <!-- 眼睛 -->
          <div class="pet-eyes">
            <div class="eye eye-left">
              <div class="eye-shine"></div>
            </div>
            <div class="eye eye-right">
              <div class="eye-shine"></div>
            </div>
          </div>

          <!-- 眨眼效果 -->
          <div class="pet-eyes blink">
            <div class="eye eye-left eye-closed"></div>
            <div class="eye eye-right eye-closed"></div>
          </div>

          <!-- 嘴巴 -->
          <div class="pet-mouth">
            <div class="mouth-smile"></div>
            <div class="mouth-o"></div>
          </div>

          <!-- 腮红 -->
          <div class="pet-cheek cheek-left"></div>
          <div class="pet-cheek cheek-right"></div>
        </div>

        <!-- 手臂 -->
        <div class="pet-arm arm-left"></div>
        <div class="pet-arm arm-right"></div>

        <!-- 腿 -->
        <div class="pet-leg leg-left"></div>
        <div class="pet-leg leg-right"></div>
      </div>

      <!-- 睡眠气泡 -->
      <div class="sleep-bubble" v-if="petState === 'sleeping'">
        <span>Z</span>
        <span class="z2">Z</span>
        <span class="z3">Z</span>
      </div>

      <!-- 开心效果 -->
      <div class="happy-effects" v-if="petState === 'happy'">
        <div class="heart heart-1">❤️</div>
        <div class="heart heart-2">✨</div>
        <div class="heart heart-3">💖</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ========================================
   DESKTOP PET - 小云朵
   ======================================== */
.desktop-pet {
  position: fixed;
  z-index: 1000;
  pointer-events: none;
}

.pet-container {
  position: absolute;
  width: 80px;
  height: 80px;
  pointer-events: auto;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.pet-container:hover {
  transform: scale(1.1);
}

.pet-container.is-dragging {
  cursor: grabbing;
  transform: scale(1.05);
}

/* ========================================
   PET SHADOW
   ======================================== */
.pet-shadow {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 12px;
  background: v-bind("petColors.shadow");
  border-radius: 50%;
  filter: blur(4px);
  transition: all 0.3s ease;
}

.pet-jumping .pet-shadow {
  transform: translateX(-50%) scale(0.6);
  opacity: 0.5;
}

/* ========================================
   PET BODY
   ======================================== */
.pet-body {
  position: relative;
  width: 70px;
  height: 70px;
  background: v-bind("petColors.body");
  border-radius: 50%;
  box-shadow:
    0 4px 20px v-bind("petColors.shadow"),
    inset 0 -4px 10px rgba(0, 0, 0, 0.1),
    inset 0 4px 10px rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.pet-body-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 30% 30%,
    v-bind("petColors.bodyGradient"),
    transparent 60%
  );
  border-radius: 50%;
}

/* 跳跃动画 */
.pet-jumping .pet-body {
  animation: jump 0.8s ease-in-out;
}

@keyframes jump {
  0%,
  100% {
    transform: translateY(0) scale(1, 1);
  }
  50% {
    transform: translateY(-40px) scale(0.95, 1.05);
  }
}

/* 行走动画 */
.pet-walking .pet-body {
  animation: walk 0.4s ease-in-out infinite;
}

@keyframes walk {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* 空闲动画 */
.pet-idle .pet-body {
  animation: idle 2s ease-in-out infinite;
}

@keyframes idle {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-3px) scale(1.02);
  }
}

/* 睡觉动画 */
.pet-sleeping .pet-body {
  animation: sleep 2s ease-in-out infinite;
}

@keyframes sleep {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-2px) scale(1.01);
  }
}

/* 开心动画 */
.pet-happy .pet-body {
  animation: happy 1.5s ease-in-out;
}

@keyframes happy {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.1) rotate(-5deg);
  }
  50% {
    transform: scale(1.15) rotate(5deg);
  }
  75% {
    transform: scale(1.1) rotate(-3deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

/* ========================================
   PET EARS
   ======================================== */
.pet-ear {
  position: absolute;
  top: -15px;
  width: 25px;
  height: 30px;
  background: v-bind("petColors.body");
  border-radius: 50% 50% 0 0;
  box-shadow: inset 0 -2px 5px rgba(0, 0, 0, 0.1);
}

.pet-ear::after {
  content: "";
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  width: 15px;
  height: 18px;
  background: v-bind("petColors.bodyGradient");
  border-radius: 50% 50% 0 0;
}

.ear-left {
  left: 5px;
  transform: rotate(-15deg);
}

.ear-right {
  right: 5px;
  transform: rotate(15deg);
}

/* 耳朵摆动动画 */
.pet-idle .pet-ear {
  animation: ear-wiggle 3s ease-in-out infinite;
}

@keyframes ear-wiggle {
  0%,
  100% {
    transform: rotate(-15deg);
  }
  50% {
    transform: rotate(-5deg);
  }
}

.pet-idle .ear-right {
  animation: ear-wiggle-right 3s ease-in-out infinite;
}

@keyframes ear-wiggle-right {
  0%,
  100% {
    transform: rotate(15deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

/* ========================================
   PET FACE
   ======================================== */
.pet-face {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 眼睛 */
.pet-eyes {
  position: absolute;
  top: 26px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 14px;
}

.eye {
  width: 14px;
  height: 14px;
  background: v-bind("petColors.eyes");
  border-radius: 50%;
  position: relative;
  transition: all 0.2s ease;
}

.eye-shine {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 5px;
  height: 5px;
  background: white;
  border-radius: 50%;
}

/* 眨眼效果 */
.pet-eyes.blink {
  display: none;
}

/* 眨眼动画 */
.pet-idle .eye,
.pet-walking .eye {
  animation: blink 4s infinite;
}

@keyframes blink {
  0%,
  45%,
  55%,
  100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.1);
  }
}

/* 闭眼 - 睡觉状态 */
.eye-closed {
  width: 14px;
  height: 3px;
  background: v-bind("petColors.eyes");
  border-radius: 0 0 50% 50%;
}

.pet-sleeping .pet-eyes {
  display: none;
}

.pet-sleeping .pet-eyes.blink {
  display: flex;
}

.pet-sleeping .eye-closed {
  height: 2px;
  border-radius: 0 0 50% 50%;
}

/* 开心时眼睛变化 */
.pet-happy .eye {
  height: 8px;
  border-radius: 0 0 50% 50%;
}

/* 嘴巴 */
.pet-mouth {
  position: absolute;
  top: 44px;
  left: 50%;
  transform: translateX(-50%);
}

.mouth-smile {
  width: 12px;
  height: 6px;
  border: none;
  border-bottom: 3px solid v-bind("petColors.eyes");
  border-radius: 0 0 50% 50%;
}

.mouth-o {
  display: none;
  width: 8px;
  height: 8px;
  border: 3px solid v-bind("petColors.eyes");
  border-radius: 50%;
}

/* 开心时嘴巴变化 */
.pet-happy .mouth-smile {
  width: 16px;
  height: 8px;
}

/* 腮红 */
.pet-cheek {
  position: absolute;
  top: 42px;
  width: 10px;
  height: 6px;
  background: v-bind("petColors.cheeks");
  border-radius: 50%;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.cheek-left {
  left: 12px;
}

.cheek-right {
  right: 12px;
}

/* 开心时腮红更明显 */
.pet-happy .pet-cheek {
  opacity: 0.9;
  width: 12px;
  height: 8px;
}

/* ========================================
   PET ARMS
   ======================================== */
.pet-arm {
  position: absolute;
  bottom: 10px;
  width: 12px;
  height: 20px;
  background: v-bind("petColors.body");
  border-radius: 10px;
  box-shadow: inset 0 -2px 5px rgba(0, 0, 0, 0.1);
}

.arm-left {
  left: -5px;
  transform: rotate(20deg);
}

.arm-right {
  right: -5px;
  transform: rotate(-20deg);
}

/* 行走时手臂摆动 */
.pet-walking .arm-left {
  animation: arm-swing-left 0.4s ease-in-out infinite;
}

.pet-walking .arm-right {
  animation: arm-swing-right 0.4s ease-in-out infinite;
}

@keyframes arm-swing-left {
  0%,
  100% {
    transform: rotate(20deg);
  }
  50% {
    transform: rotate(-10deg);
  }
}

@keyframes arm-swing-right {
  0%,
  100% {
    transform: rotate(-20deg);
  }
  50% {
    transform: rotate(10deg);
  }
}

/* 开心时手臂向上 */
.pet-happy .arm-left {
  animation: arm-happy-left 1.5s ease-in-out;
}

.pet-happy .arm-right {
  animation: arm-happy-right 1.5s ease-in-out;
}

@keyframes arm-happy-left {
  0%,
  100% {
    transform: rotate(20deg);
  }
  50% {
    transform: rotate(-30deg);
  }
}

@keyframes arm-happy-right {
  0%,
  100% {
    transform: rotate(-20deg);
  }
  50% {
    transform: rotate(30deg);
  }
}

/* ========================================
   PET LEGS
   ======================================== */
.pet-leg {
  position: absolute;
  bottom: -5px;
  width: 14px;
  height: 12px;
  background: v-bind("petColors.body");
  border-radius: 10px 10px 50% 50%;
  box-shadow: inset 0 -2px 5px rgba(0, 0, 0, 0.1);
}

.leg-left {
  left: 15px;
}

.leg-right {
  right: 15px;
}

/* 行走时腿部移动 */
.pet-walking .leg-left {
  animation: leg-move-left 0.4s ease-in-out infinite;
}

.pet-walking .leg-right {
  animation: leg-move-right 0.4s ease-in-out infinite;
}

@keyframes leg-move-left {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

@keyframes leg-move-right {
  0%,
  100% {
    transform: translateY(-3px);
  }
  50% {
    transform: translateY(0);
  }
}

/* ========================================
   SLEEP BUBBLE
   ======================================== */
.sleep-bubble {
  position: absolute;
  top: -30px;
  right: -20px;
  font-size: 16px;
  animation: float-up 2s ease-in-out infinite;
}

.sleep-bubble span {
  display: block;
  opacity: 0;
  animation: z-fade 2s ease-in-out infinite;
}

.sleep-bubble .z2 {
  animation-delay: 0.5s;
  margin-left: 10px;
}

.sleep-bubble .z3 {
  animation-delay: 1s;
  margin-left: 20px;
}

@keyframes float-up {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes z-fade {
  0% {
    opacity: 0;
    transform: translateY(5px);
  }
  50% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}

/* ========================================
   HAPPY EFFECTS
   ======================================== */
.happy-effects {
  position: absolute;
  inset: -20px;
  pointer-events: none;
}

.heart {
  position: absolute;
  font-size: 16px;
  animation: heart-float 1.5s ease-out forwards;
  opacity: 0;
}

.heart-1 {
  top: 0;
  left: -10px;
  animation-delay: 0s;
}

.heart-2 {
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 0.2s;
}

.heart-3 {
  top: 0;
  right: -10px;
  animation-delay: 0.4s;
}

@keyframes heart-float {
  0% {
    opacity: 0;
    transform: translateY(0) scale(0.5);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(-30px) scale(1.2);
  }
}

/* ========================================
   RESPONSIVE
   ======================================== */
@media (max-width: 640px) {
  .pet-container {
    width: 60px;
    height: 60px;
  }

  .pet-body {
    width: 50px;
    height: 50px;
  }

  .pet-ear {
    width: 18px;
    height: 22px;
    top: -12px;
  }

  .pet-ear::after {
    width: 10px;
    height: 12px;
  }

  .pet-eyes {
    top: 18px;
    gap: 10px;
  }

  .eye {
    width: 10px;
    height: 10px;
  }

  .eye-shine {
    width: 3px;
    height: 3px;
  }

  .pet-cheek {
    top: 30px;
    width: 8px;
    height: 5px;
  }

  .pet-mouth {
    top: 32px;
  }

  .mouth-smile {
    width: 10px;
    height: 5px;
  }

  .pet-arm {
    width: 8px;
    height: 15px;
  }

  .pet-leg {
    width: 10px;
    height: 8px;
  }

  .sleep-bubble {
    font-size: 12px;
    top: -25px;
  }

  .happy-effects .heart {
    font-size: 12px;
  }
}
</style>
