/* eslint-disable unicorn/consistent-function-scoping */
import { createSchemaField } from '@formily/vue'
import { userEvent } from '@vitest/browser/context'
import { ElButton } from 'element-plus'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { FormDrawer, FormItem, Input } from '../../'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/el-input.css'
import 'element-plus/theme-chalk/el-button.css'
import 'element-plus/theme-chalk/el-drawer.css'
// import 'element-plus/theme-chalk/el-overlay.css' // FIXME 引入overlay会引起headless测试异常

const { SchemaField, SchemaStringField } = createSchemaField({ components: { Input, FormItem } })

describe('FormDrawer', () => {
  afterEach(() => {
    vi.clearAllMocks()
    document.body.innerHTML = ''
  })

  describe('基础功能', () => {
    it('应该支持打开和关闭抽屉', async () => {
      const TestComponent = () => {
        const handleOpen = () => {
          FormDrawer('测试标题', () => (
            <div data-testid="drawer-content">抽屉内容</div>
          )).open().catch(console.log)
        }
        return <ElButton onClick={handleOpen}>打开抽屉</ElButton>
      }

      const { getByText, getByRole } = render(() => <TestComponent />, {
        global: {
          stubs: {
            Transition: false,
          },
        },
      })
      await getByText('打开抽屉').click()
      await expect.element(getByText('测试标题')).toBeInTheDocument()
      await expect.element(getByText('取消')).toBeInTheDocument()
      await getByText('取消').click()
      await vi.waitFor(() => {
        expect(document.querySelector('.el-drawer')).toBeNull()
      }, { timeout: 2000 })
      await getByText('打开抽屉').click()
      await expect.element(getByRole('button', { name: '确定' })).toBeInTheDocument()
      await getByRole('button', { name: '确定' }).click()
      await getByText('打开抽屉').click()
      await expect.element(getByRole('button', { name: 'Close this dialog' })).toBeInTheDocument()
      await getByRole('button', { name: 'Close this dialog' }).click()
      await vi.waitFor(() => {
        expect(document.querySelector('.el-drawer')).toBeNull()
      }, { timeout: 2000 })
    })

    it('应该支持渲染组件', async () => {
      const { SchemaField } = createSchemaField({
        components: {
          FormItem,
          Input,
        },
      })
      const DialogForm = {
        data() {
          const schema = {
            type: 'object',
            properties: {
              aaa: {
                'type': 'string',
                'title': '输入框1',
                'required': true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
              bbb: {
                'type': 'string',
                'title': '输入框2',
                'required': true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
              ccc: {
                'type': 'string',
                'title': '输入框3',
                'required': true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
              ddd: {
                'type': 'string',
                'title': '输入框4',
                'required': true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
            },
          }
          return {
            schema,
          }
        },
        render() {
          return (<SchemaField schema={this.schema} />)
        },
      }
      const TestComponent = () => {
        const handleOpen = () => {
          FormDrawer('测试标题', DialogForm).open().catch(console.log)
        }
        return <ElButton onClick={handleOpen}>打开抽屉</ElButton>
      }

      const { getByText } = render(() => <TestComponent />, {
        global: {
          stubs: {
            Transition: false,
          },
        },
      })
      await getByText('打开抽屉').click()
      await expect.element(getByText('输入框4')).toBeInTheDocument()
      await getByText('取消').click()
      await vi.waitFor(() => {
        expect(document.querySelector('.el-drawer')).toBeNull()
      }, { timeout: 2000 })
    })
  })

  describe('中间件功能', () => {
    it('应该支持 forOpen 中间件', async () => {
      const openMiddleware = vi.fn((props, next) => next({ initialValues: { input: 'test' } }))
      const TestComponent = () => {
        const handleOpen = () => {
          FormDrawer('测试标题', () => (
            <SchemaField>
              <SchemaStringField
                name="input"
                title="输入框"
                x-decorator="FormItem"
                x-component="Input"
                x-component-props={{
                  placeholder: '请输入',
                }}
                required={true}
              />
            </SchemaField>
          ))
            .forOpen(openMiddleware)
            .open()
            .catch(console.log)
        }
        return <ElButton onClick={handleOpen}>打开抽屉</ElButton>
      }

      const { getByText } = render(() => <TestComponent />, {
        global: {
          stubs: {
            Transition: false,
          },
        },
      })
      await getByText('打开抽屉').click()
      expect(openMiddleware).toHaveBeenCalled()
      expect(document.querySelector('input')).toHaveValue('test')
      await getByText('取消').click()
    })

    it('应该支持 forConfirm 中间件', async () => {
      const forConfirm = vi.fn()
      const TestComponent = () => {
        const handleOpen = () => {
          FormDrawer('测试标题', () => (
            <SchemaField>
              <SchemaStringField
                name="input"
                title="输入框"
                x-decorator="FormItem"
                x-component="Input"
                x-component-props={{
                  placeholder: '请输入',
                }}
                required={true}
              />
            </SchemaField>
          ))
            .forConfirm((form, next) => {
              setTimeout(() => {
                forConfirm(form.values)
                next()
              }, 200)
            })
            .open()
            .catch(console.log)
        }
        return <ElButton onClick={handleOpen}>支持 forConfirm</ElButton>
      }

      const { container } = render(() => <TestComponent />, {
        global: {
          stubs: {
            Transition: false,
          },
        },
      })

      await expect.element(container.querySelector('.el-button')).toBeInTheDocument()
      await userEvent.click(container.querySelector('.el-button'))
      const input = document.querySelector('input')
      await userEvent.type(input, 'test')
      const confirmButton = document.querySelector('.el-button--primary')
      await userEvent.click(confirmButton)
      await expect.element(confirmButton).toHaveClass('is-loading')
      await vi.waitFor(() => {
        expect(forConfirm).toHaveBeenCalled()
        expect(forConfirm).toHaveBeenCalledWith({ input: 'test' })
        expect(document.querySelector('.el-drawer')).toBeNull()
      })
    })

    it('应该支持 forCancel 中间件', async () => {
      const forCancel = vi.fn()
      const TestComponent = () => {
        const handleOpen = () => {
          FormDrawer('测试标题', () => (
            <SchemaField>
              <SchemaStringField
                name="input"
                title="输入框"
                x-decorator="FormItem"
                x-component="Input"
                x-component-props={{
                  placeholder: '请输入',
                }}
                required={true}
              />
            </SchemaField>
          ))
            .forCancel((form, next) => {
              setTimeout(() => {
                forCancel(form.values)
                next()
              }, 200)
            })
            .open()
            .catch(console.log)
        }
        return <ElButton onClick={handleOpen}>打开抽屉</ElButton>
      }

      const { getByText } = render(() => <TestComponent />, {
        global: {
          stubs: {
            Transition: false,
          },
        },
      })

      await getByText('打开抽屉').click()
      await getByText('取消').click()
      await vi.waitFor(() => {
        expect(document.querySelector('.el-drawer')).toBeNull()
        expect(forCancel).toHaveBeenCalled()
      })
    })
  })

  describe('自定义内容', () => {
    it('应该支持自定义 footer', async () => {
      const forExtra = vi.fn()
      const TestComponent = () => {
        const handleOpen = () => {
          FormDrawer('表单抽屉', {
            default: () => (
              <SchemaField>
                <SchemaStringField
                  name="input"
                  title="输入框"
                  x-decorator="FormItem"
                  x-component="Input"
                  x-component-props={{
                    placeholder: '请输入',
                  }}
                  required={true}
                />
              </SchemaField>
            ),
            footer: ({ form, resolve, reject }) => {
              return [
                <ElButton
                  onClick={() => reject()}
                >
                  取消
                </ElButton>,
                <ElButton loading={form.submitting} onClick={() => resolve('extra')}>保存草稿</ElButton>,
                <ElButton
                  type="primary"
                  loading={form.submitting}
                  onClick={() => resolve()}
                >
                  确定
                </ElButton>,
              ]
            },
          }, ['extra']).forExtra((form, next) => {
            forExtra(form.values)
            next()
          }).open().catch(console.log)
        }

        return <ElButton onClick={handleOpen}>打开表单</ElButton>
      }
      const { getByText } = render(() => <TestComponent />)
      await userEvent.click(getByText('打开表单'))
      const input = document.querySelector('input')
      await userEvent.type(input, 'testuser')
      await getByText('保存草稿').click()
      await vi.waitFor(() => {
        expect(forExtra).toHaveBeenCalled()
        expect(forExtra).toHaveBeenCalledWith({ input: 'testuser' })
      })
    })

    it('应该支持自定义标题', async () => {
      const forCancel = vi.fn()
      const TestComponent = () => {
        const handleOpen = () => {
          FormDrawer({ title: '表单抽屉', okText: '确认提交', cancelText: '我不想要了' }, {
            default: () => (
              <SchemaField>
                <SchemaStringField
                  name="input"
                  title="输入框"
                  x-decorator="FormItem"
                  x-component="Input"
                  x-component-props={{
                    placeholder: '请输入',
                  }}
                  required={true}
                />
              </SchemaField>
            ),
            header: ({ reject }) => (
              <div>
                <ElButton onClick={() => reject()}>关闭</ElButton>
                <span>这是标题</span>
              </div>

            ),
          }).forCancel((form, next) => {
            forCancel(form.values)
            next()
          }).open().catch(console.log)
        }
        return <ElButton onClick={handleOpen}>打开表单</ElButton>
      }

      const { getByText } = render(() => <TestComponent />)
      await userEvent.click(getByText('打开表单'))
      await expect.element(getByText('这是标题')).toBeInTheDocument()
      await expect.element(getByText('我不想要了')).toBeInTheDocument()
      await expect.element(getByText('确认提交')).toBeInTheDocument()
      await userEvent.click(getByText('关闭'))
      await vi.waitFor(() => {
        expect(forCancel).toHaveBeenCalled()
      })
    })
  })

  describe('异步执行顺序', () => {
    it('应该弹框打开过程中之后的异步操作会等待表单提交后再执行', async () => {
      const forConfirm = vi.fn()
      const fn1 = vi.fn()
      const TestComponent = () => {
        async function handleOpen() {
          await FormDrawer('测试标题', () => (
            <SchemaField>
              <SchemaStringField
                name="input"
                title="输入框"
                x-decorator="FormItem"
                x-component="Input"
                x-component-props={{
                  placeholder: '请输入',
                }}
                required={true}
              />
            </SchemaField>
          ))
            .forConfirm((form, next) => {
              setTimeout(() => {
                forConfirm(form.values)
                next()
              }, 200)
            })
            .open()
          fn1()
        }
        return <ElButton onClick={handleOpen}>打开抽屉</ElButton>
      }

      const { container } = render(() => <TestComponent />, {
        global: {
          stubs: {
            Transition: false,
          },
        },
      })

      await expect.element(container.querySelector('.el-button')).toBeInTheDocument()
      await userEvent.click(container.querySelector('.el-button'))
      const input = document.querySelector('input')
      await userEvent.type(input, 'test')
      const confirmButton = document.querySelector('.el-button--primary')
      expect(fn1).not.toHaveBeenCalled()
      await userEvent.click(confirmButton)
      await expect.element(confirmButton).toHaveClass('is-loading')
      await vi.waitFor(() => {
        expect(forConfirm).toHaveBeenCalled()
        expect(forConfirm).toHaveBeenCalledWith({ input: 'test' })
        expect(document.querySelector('.el-drawer')).toBeNull()
        expect(fn1).toHaveBeenCalled()
      })
    })

    it('应该表单校验失败时弹框不会关闭，表单完成后之后的逻辑会继续执行', async () => {
      const forConfirm = vi.fn()
      const fn1 = vi.fn()
      const TestComponent = () => {
        async function handleOpen() {
          await FormDrawer('测试标题', () => (
            <SchemaField>
              <SchemaStringField
                name="input"
                title="输入框"
                x-decorator="FormItem"
                x-component="Input"
                x-component-props={{
                  placeholder: '请输入',
                }}
                required={true}
              />
            </SchemaField>
          ))
            .forConfirm((form, next) => {
              setTimeout(() => {
                forConfirm(form.values)
                next()
              }, 200)
            })
            .open()
            .catch(console.log)
          fn1()
        }
        return <ElButton onClick={handleOpen}>打开抽屉</ElButton>
      }

      const { container } = render(() => <TestComponent />, {
        global: {
          stubs: {
            Transition: false,
          },
        },
      })

      await expect.element(container.querySelector('.el-button')).toBeInTheDocument()
      await userEvent.click(container.querySelector('.el-button'))
      const confirmButton = document.querySelector('.el-button--primary')
      expect(fn1).not.toHaveBeenCalled()
      await userEvent.click(confirmButton)
      await expect.element(document.querySelector('.el-form-item__content .is-error')).toBeInTheDocument()
      await vi.waitFor(() => {
        expect(fn1).not.toHaveBeenCalled()
      })
      const input = document.querySelector('input')
      await userEvent.type(input, 'test')
      await userEvent.click(confirmButton)
      await vi.waitFor(() => {
        expect(fn1).toHaveBeenCalled()
      })
    })
  })

  describe('DOM销毁测试', () => {
    it('应该在drawer成功提交后销毁DOM', async () => {
      const TestComponent = () => {
        const handleOpen = () => {
          FormDrawer('测试标题', () => (
            <SchemaField>
              <SchemaStringField
                name="input"
                title="输入框"
                x-decorator="FormItem"
                x-component="Input"
                x-component-props={{
                  placeholder: '请输入',
                }}
                required={true}
              />
            </SchemaField>
          )).open().catch(console.log)
        }
        return <ElButton onClick={handleOpen}>打开抽屉</ElButton>
      }

      const { container } = render(() => <TestComponent />, {
        global: {
          stubs: {
            Transition: false,
          },
        },
      })

      // 记录初始DOM状态
      const initialBodyChildren = document.body.children.length

      // 打开drawer
      await userEvent.click(container.querySelector('.el-button'))

      // 验证drawer已打开，DOM元素增加
      await expect.element(document.querySelector('.el-drawer')).toBeInTheDocument()
      expect(document.body.children.length).toBeGreaterThan(initialBodyChildren)

      // 填写表单并提交
      const input = document.querySelector('input')
      await userEvent.type(input, 'test')
      const confirmButton = document.querySelector('.el-button--primary')
      await userEvent.click(confirmButton)

      // 等待动画完成和DOM销毁
      await vi.waitFor(() => {
        expect(document.querySelector('.el-drawer')).toBeNull()
      }, { timeout: 2000 })

      // 验证DOM已完全清理，回到初始状态
      await vi.waitFor(() => {
        expect(document.body.children.length).toBeLessThanOrEqual(initialBodyChildren + 2) // +1 for test container
      }, { timeout: 2000 })
    })

    it('应该在drawer取消后销毁DOM', async () => {
      const TestComponent = () => {
        const handleOpen = () => {
          FormDrawer('测试标题', () => (
            <SchemaField>
              <SchemaStringField
                name="input"
                title="输入框"
                x-decorator="FormItem"
                x-component="Input"
                x-component-props={{
                  placeholder: '请输入',
                }}
                required={true}
              />
            </SchemaField>
          )).open().catch(console.log)
        }
        return <ElButton onClick={handleOpen}>打开抽屉</ElButton>
      }

      const { container, getByText } = render(() => <TestComponent />, {
        global: {
          stubs: {
            Transition: false,
          },
        },
      })

      // 记录初始DOM状态
      const initialBodyChildren = document.body.children.length

      // 打开drawer
      await userEvent.click(container.querySelector('.el-button'))

      // 验证drawer已打开，DOM元素增加
      await expect.element(document.querySelector('.el-drawer')).toBeInTheDocument()
      expect(document.body.children.length).toBeGreaterThan(initialBodyChildren)

      // 点击取消按钮
      const cancelButton = getByText('取消')
      await userEvent.click(cancelButton)

      await vi.waitFor(() => {
        expect(document.querySelector('.el-drawer')).toBeNull()
        expect(document.body.children.length).toBeLessThanOrEqual(initialBodyChildren + 2) // +1 for test container
      }, { timeout: 2000 })
    })

    it('应该在drawer关闭按钮点击后销毁DOM', async () => {
      const TestComponent = () => {
        const handleOpen = () => {
          FormDrawer('测试标题', () => (
            <div data-testid="drawer-content">抽屉内容</div>
          )).open().catch(console.log)
        }
        return <ElButton onClick={handleOpen}>打开抽屉</ElButton>
      }

      const { container } = render(() => <TestComponent />, {
        global: {
          stubs: {
            Transition: false,
          },
        },
      })

      // 记录初始DOM状态
      const initialBodyChildren = document.body.children.length

      // 打开drawer
      await userEvent.click(container.querySelector('.el-button'))

      // 验证drawer已打开，DOM元素增加
      await expect.element(document.querySelector('.el-drawer')).toBeInTheDocument()
      expect(document.body.children.length).toBeGreaterThan(initialBodyChildren)

      // 点击关闭按钮（X按钮）
      const closeButton = document.querySelector('.el-drawer__close-btn')
      await userEvent.click(closeButton)

      // 等待动画完成和DOM销毁
      await vi.waitFor(() => {
        expect(document.querySelector('.el-drawer')).toBeNull()
      }, { timeout: 2000 })

      // 验证DOM已完全清理，回到初始状态
      await vi.waitFor(() => {
        expect(document.body.children.length).toBeLessThanOrEqual(initialBodyChildren + 2) // +1 for test container
      }, { timeout: 2000 })
    })

    it('应该多次打开和关闭drawer不且造成DOM泄漏', async () => {
      const TestComponent = () => {
        const handleOpen = () => {
          FormDrawer('测试标题', () => (
            <div data-testid="drawer-content">抽屉内容</div>
          )).open().catch(console.log)
        }
        return <ElButton onClick={handleOpen}>打开抽屉</ElButton>
      }

      const { container, getByText } = render(() => <TestComponent />, {
        global: {
          stubs: {
            Transition: false,
          },
        },
      })

      // 记录初始DOM状态
      const initialBodyChildren = document.body.children.length

      // 多次打开和关闭drawer
      for (let i = 0; i < 3; i++) {
        // 打开drawer
        await userEvent.click(container.querySelector('.el-button'))
        await expect.element(document.querySelector('.el-drawer')).toBeInTheDocument()

        // 关闭drawer
        const cancelButton = getByText('取消')
        await userEvent.click(cancelButton)

        // 等待DOM销毁
        await vi.waitFor(() => {
          expect(document.querySelector('.el-drawer')).toBeNull()
        }, { timeout: 2000 })
      }

      // 验证最终DOM状态没有泄漏
      await vi.waitFor(() => {
        expect(document.body.children.length).toBeLessThanOrEqual(initialBodyChildren + 2) // +1 for test container
      }, { timeout: 2000 })
    })

    it('应该在提供 beforeClose 回调时正确调用', async () => {
      const beforeCloseMock = vi.fn()
      const TestComponent = () => {
        const handleOpen = () => {
          FormDrawer({ title: '测试标题', beforeClose: beforeCloseMock }, () => (
            <div data-testid="drawer-content">抽屉内容</div>
          )).open().catch(console.log)
        }
        return <ElButton onClick={handleOpen}>打开抽屉</ElButton>
      }

      const { container } = render(() => <TestComponent />, {
        global: {
          stubs: {
            Transition: false,
          },
        },
      })

      await userEvent.click(container.querySelector('.el-button'))
      await expect.element(document.querySelector('.el-drawer')).toBeInTheDocument()

      const closeButton = document.querySelector('.el-drawer__close-btn')
      await userEvent.click(closeButton)

      expect(beforeCloseMock).toHaveBeenCalledTimes(1)
      expect(beforeCloseMock).toHaveBeenCalledWith(expect.any(Function))
    })
  })
})
